/**
 * @file 账户迁移辅助工具
 * @description 用于将现有账户迁移到 Neon Auth
 */

import { useDb } from "server/db";
import { authUserMapping, smStaff, hpOwners } from "@01s-11comm/type";
import { eq, and, isNull } from "drizzle-orm";
import { createError } from "nitro/h3";
import consola from "consola";
import type { H3Event } from "nitro/h3";
import { useAuthClient } from "./auth-client";

/**
 * 迁移状态
 */
export enum MigrationStatus {
	PENDING = "pending",
	IN_PROGRESS = "in_progress",
	COMPLETED = "completed",
	FAILED = "failed",
}

/**
 * 账户迁移记录
 */
export interface MigrationRecord {
	/** 旧系统用户ID */
	oldUserId: string;
	/** Neon Auth 用户ID */
	neonAuthId?: string;
	/** 用户类型：staff | owner */
	userType: "staff" | "owner";
	/** 迁移状态 */
	status: MigrationStatus;
	/** 迁移错误信息 */
	error?: string;
	/** 迁移时间 */
	migratedAt?: Date;
}

/**
 * 导出员工账户数据
 * @param event - H3 事件对象，用于获取 Auth 客户端
 * @returns 员工账户列表
 */
export async function exportStaffAccounts(event?: H3Event) {
	const db = useDb();

	// 查询所有员工账户（已迁移和未迁移）
	const staffAccounts = await db.query.smStaff.findMany({
		columns: {
			id: true,
			employeeNumber: true,
			name: true,
			email: true,
			phone: true,
			position: true,
			neonAuthId: true,
		},
	});

	return staffAccounts;
}

/**
 * 导出未迁移的员工账户数据
 * @returns 未迁移的员工账户列表
 */
export async function exportUnmigratedStaffAccounts() {
	const db = useDb();

	// 查询未迁移的员工账户（neon_auth_id 为空）
	const staffAccounts = await db.query.smStaff.findMany({
		where: and(isNull(smStaff.neonAuthId)),
		columns: {
			id: true,
			employeeNumber: true,
			name: true,
			email: true,
			phone: true,
			position: true,
		},
	});

	return staffAccounts;
}

/**
 * 导出业主账户数据
 * @returns 业主账户列表
 */
export async function exportOwnerAccounts() {
	const db = useDb();

	// 查询所有业主账户
	const ownerAccounts = await db.query.hpOwners.findMany({
		columns: {
			id: true,
			name: true,
			phone: true,
			idCard: true,
			email: true,
			neonAuthId: true,
		},
	});

	return ownerAccounts;
}

/**
 * 导出未迁移的业主账户数据
 * @returns 未迁移的业主账户列表
 */
export async function exportUnmigratedOwnerAccounts() {
	const db = useDb();

	// 查询未迁移的业主账户（neon_auth_id 为空）
	const ownerAccounts = await db.query.hpOwners.findMany({
		where: and(isNull(hpOwners.neonAuthId)),
		columns: {
			id: true,
			name: true,
			phone: true,
			idCard: true,
			email: true,
		},
	});

	return ownerAccounts;
}

/**
 * 创建 Neon Auth 用户并建立映射
 * @param event - H3 事件对象，用于获取 Auth 客户端
 * @param email - 用户邮箱
 * @param password - 用户密码
 * @param userType - 用户类型：staff | owner
 * @param metadata - 额外的元数据
 * @returns Neon Auth 用户 ID
 */
export async function createNeonAuthUser(
	event: H3Event,
	email: string,
	password: string,
	userType: "staff" | "owner",
	metadata?: Record<string, any>,
): Promise<string> {
	const db = useDb();

	try {
		// 使用 Neon Auth API 创建用户
		const authClient = useAuthClient(event);

		const { data, error } = await authClient.signUp.email({
			email,
			password,
			name: metadata?.name || email.split("@")[0],
		});

		if (error) {
			consola.error(`[Migration] Neon Auth signUp error: ${error.message}`);
			throw createError({
				statusCode: 400,
				message: `创建 Neon Auth 用户失败: ${error.message}`,
			});
		}

		// 获取 Neon Auth 用户 ID
		const neonAuthId = data?.user?.id;

		if (!neonAuthId) {
			throw new Error("无法获取 Neon Auth 用户 ID");
		}

		// 在映射表中创建记录
		await db.insert(authUserMapping).values({
			neonAuthId,
			userType,
			...(metadata?.staffId ? { staffId: metadata.staffId } : {}),
			...(metadata?.ownerId ? { ownerId: metadata.ownerId } : {}),
			migrated: true,
			migratedAt: new Date(),
		});

		// 更新员工或业主表的 neon_auth_id 字段
		if (userType === "staff" && metadata?.staffId) {
			await db.update(smStaff).set({ neonAuthId: neonAuthId }).where(eq(smStaff.id, metadata.staffId));
		} else if (userType === "owner" && metadata?.ownerId) {
			await db.update(hpOwners).set({ neonAuthId: neonAuthId }).where(eq(hpOwners.id, metadata.ownerId));
		}

		consola.success(`[Migration] Created Neon Auth user: ${neonAuthId} for ${email}`);

		return neonAuthId;
	} catch (error: any) {
		consola.error(`[Migration] Failed to create Neon Auth user: ${error.message}`);
		throw error;
	}
}

/**
 * 批量迁移账户
 * @param event - H3 事件对象，用于获取 Auth 客户端
 * @param accounts - 要迁移的账户列表
 * @returns 迁移结果记录
 */
export async function batchMigrateAccounts(
	event: H3Event,
	accounts: Array<{
		oldId: string;
		email: string;
		password: string;
		userType: "staff" | "owner";
	}>,
): Promise<MigrationRecord[]> {
	const results: MigrationRecord[] = [];

	for (const account of accounts) {
		const record: MigrationRecord = {
			oldUserId: account.oldId,
			userType: account.userType,
			status: MigrationStatus.IN_PROGRESS,
		};

		try {
			// 创建 Neon Auth 用户
			const neonAuthId = await createNeonAuthUser(event, account.email, account.password, account.userType, {
				staffId: account.userType === "staff" ? account.oldId : undefined,
				ownerId: account.userType === "owner" ? account.oldId : undefined,
			});

			record.neonAuthId = neonAuthId;
			record.status = MigrationStatus.COMPLETED;
			record.migratedAt = new Date();

			consola.success(`[Migration] Migrated account: ${account.oldId}`);
		} catch (error: any) {
			record.status = MigrationStatus.FAILED;
			record.error = error.message;

			consola.error(`[Migration] Failed to migrate account: ${account.oldId}`, error);
		}

		results.push(record);
	}

	return results;
}

/**
 * 获取迁移状态
 */
export async function getMigrationStatus(oldUserId: string): Promise<MigrationRecord | null> {
	const db = useDb();

	const mapping = await db.query.authUserMapping.findFirst({
		where: eq(authUserMapping.staffId, oldUserId),
	});

	if (!mapping) {
		return null;
	}

	return {
		oldUserId,
		neonAuthId: mapping.neonAuthId || undefined,
		userType: mapping.userType as "staff" | "owner",
		status: mapping.migrated ? MigrationStatus.COMPLETED : MigrationStatus.PENDING,
		migratedAt: mapping.migratedAt || undefined,
	};
}

/**
 * 验证迁移后账户是否可以登录
 * @param event - H3 事件对象，用于获取 Auth 客户端
 * @param email - 用户邮箱
 * @param password - 用户密码
 * @returns 验证结果
 */
export async function verifyMigratedAccount(
	event: H3Event,
	email: string,
	password: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		// 尝试使用 Neon Auth 登录
		const authClient = useAuthClient(event);

		const { data, error } = await authClient.signIn.email({
			email,
			password,
		});

		if (error) {
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: !!data?.session,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
		};
	}
}

/**
 * 创建旧账户 ID 与新用户 ID 的映射
 */
export async function createIdMapping(oldId: string, neonAuthId: string, userType: "staff" | "owner") {
	const db = useDb();

	await db.insert(authUserMapping).values({
		neonAuthId,
		staffId: userType === "staff" ? oldId : undefined,
		ownerId: userType === "owner" ? oldId : undefined,
		userType,
		migrated: true,
		migratedAt: new Date(),
	});
}

/**
 * 根据 Neon Auth ID 获取旧系统用户 ID
 */
export async function getOldUserId(neonAuthId: string): Promise<{ oldId: string; userType: "staff" | "owner" } | null> {
	const db = useDb();

	const mapping = await db.query.authUserMapping.findFirst({
		where: eq(authUserMapping.neonAuthId, neonAuthId),
	});

	if (!mapping) {
		return null;
	}

	return {
		oldId: mapping.staffId || mapping.ownerId || "",
		userType: mapping.userType as "staff" | "owner",
	};
}

/**
 * 检查账户是否已迁移
 */
export async function isAccountMigrated(oldUserId: string): Promise<boolean> {
	const db = useDb();

	const mapping = await db.query.authUserMapping.findFirst({
		where: eq(authUserMapping.staffId, oldUserId),
	});

	return mapping?.migrated || false;
}

/**
 * 获取迁移统计信息
 * @returns 迁移统计信息
 */
export async function getMigrationStats(): Promise<{
	totalStaff: number;
	migratedStaff: number;
	totalOwners: number;
	migratedOwners: number;
}> {
	const db = useDb();

	// 统计员工账户
	const allStaff = await db.query.smStaff.findMany({
		columns: {
			neonAuthId: true,
		},
	});
	const migratedStaff = allStaff.filter((s) => s.neonAuthId).length;

	// 统计业主账户
	const allOwners = await db.query.hpOwners.findMany({
		columns: {
			neonAuthId: true,
		},
	});
	const migratedOwners = allOwners.filter((o) => o.neonAuthId).length;

	return {
		totalStaff: allStaff.length,
		migratedStaff,
		totalOwners: allOwners.length,
		migratedOwners,
	};
}
