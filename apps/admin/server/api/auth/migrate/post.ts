/**
 * 账户迁移 API
 * @description 执行账户迁移到 Neon Auth
 */

import { defineHandler, readBody } from "nitro/h3";
import type { H3Event } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { authUserMapping, smStaff, hpOwners } from "@01s-11comm/type";
import { eq, and, isNull } from "drizzle-orm";
import { createError } from "nitro/h3";
import consola from "consola";
import { useAuthClient } from "server/utils/auth-client";
import type { JsonVO } from "@01s-11comm/type";

/** 迁移状态 */
enum MigrationStatus {
	PENDING = "pending",
	IN_PROGRESS = "in_progress",
	COMPLETED = "completed",
	FAILED = "failed",
}

/** 迁移记录 */
interface MigrationRecord {
	oldUserId: string;
	neonAuthId?: string;
	userType: "staff" | "owner";
	status: MigrationStatus;
	error?: string;
	migratedAt?: Date;
}

/** 迁移请求参数 */
const migrateSchema = z.object({
	accounts: z.array(
		z.object({
			oldId: z.string().uuid("无效的用户 ID"),
			email: z.string().email("请输入有效的邮箱地址"),
			password: z.string().min(6, "密码长度至少为 6 位"),
			userType: z.enum(["staff", "owner"]),
		}),
	),
});

/**
 * 执行单个账户迁移
 */
async function migrateSingleAccount(
	event: H3Event,
	oldId: string,
	email: string,
	password: string,
	userType: "staff" | "owner",
): Promise<MigrationRecord> {
	const db = useDb(event);
	const record: MigrationRecord = {
		oldUserId: oldId,
		userType,
		status: MigrationStatus.IN_PROGRESS,
	};

	try {
		// 使用 Neon Auth API 创建用户
		const authClient = useAuthClient(event);

		const { data, error } = await authClient.signUp.email({
			email,
			password,
			name: email.split("@")[0],
		});

		if (error) {
			throw new Error(error.message);
		}

		// 获取 Neon Auth 用户 ID
		const neonAuthId = data?.user?.id;

		if (!neonAuthId) {
			throw new Error("无法获取 Neon Auth 用户 ID");
		}

		// 在映射表中创建记录 - 使用类型断言处理 schema 类型问题
		const mappingValues = {
			neonAuthId,
			userType,
			...(userType === "staff" ? { staffId: oldId } : { ownerId: oldId }),
			migrated: true,
			migratedAt: new Date(),
		};
		await db.insert(authUserMapping).values(mappingValues as any);

		// 更新员工或业主表的 neon_auth_id 字段 - 使用类型断言处理 schema 类型问题
		if (userType === "staff") {
			await db
				.update(smStaff)
				.set({ neonAuthId } as any)
				.where(eq(smStaff.id, oldId));
		} else {
			await db
				.update(hpOwners)
				.set({ neonAuthId } as any)
				.where(eq(hpOwners.id, oldId));
		}

		record.neonAuthId = neonAuthId;
		record.status = MigrationStatus.COMPLETED;
		record.migratedAt = new Date();

		consola.success(`[Migration] Migrated account: ${oldId}`);
	} catch (error: any) {
		record.status = MigrationStatus.FAILED;
		record.error = error.message;
		consola.error(`[Migration] Failed to migrate account: ${oldId}`, error);
	}

	return record;
}

export default defineHandler(async (event) => {
	try {
		/** 获取并验证请求参数 */
		const body = await readBody(event);
		const parsed = migrateSchema.parse(body);

		if (!parsed.accounts || parsed.accounts.length === 0) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 400,
				message: "请提供要迁移的账户列表",
				data: null,
			};
			return errorResponse;
		}

		const results: MigrationRecord[] = [];

		/** 逐个执行迁移 */
		for (const account of parsed.accounts) {
			const result = await migrateSingleAccount(
				event,
				account.oldId,
				account.email,
				account.password,
				account.userType,
			);
			results.push(result);
		}

		/** 统计迁移结果 */
		const successCount = results.filter((r) => r.status === MigrationStatus.COMPLETED).length;
		const failedCount = results.filter((r) => r.status === MigrationStatus.FAILED).length;

		const response: JsonVO<MigrationRecord[]> = {
			success: failedCount === 0,
			code: failedCount === 0 ? 200 : 206,
			message: `迁移完成：成功 ${successCount} 个，失败 ${failedCount} 个`,
			data: results,
		};

		return response;
	} catch (error: any) {
		console.error("[Migration] Error:", error);

		/** 参数验证错误 */
		if (error instanceof z.ZodError) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 400,
				message: error.errors[0]?.message || "请求参数无效",
				data: null,
				error: error.message,
			};
			return errorResponse;
		}

		/** 通用错误 */
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "账户迁移失败",
			data: null,
			error: error.message || String(error),
		};
		return errorResponse;
	}
});
