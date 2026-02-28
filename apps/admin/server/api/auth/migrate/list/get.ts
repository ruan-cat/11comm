/**
 * 获取未迁移账户列表 API
 * @description 获取需要迁移的账户列表
 */

import { defineHandler } from "nitro/h3";
import { useDb } from "server/db";
import { smStaff, hpOwners } from "@01s-11comm/type";
import { isNull, and } from "drizzle-orm";
import type { JsonVO } from "@01s-11comm/type";

/** 未迁移账户数据 */
interface UnmigratedAccount {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	userType: "staff" | "owner";
}

/** 响应数据 */
interface UnmigratedAccountsResponse {
	staff: UnmigratedAccount[];
	owners: UnmigratedAccount[];
	total: number;
}

export default defineHandler(async (event) => {
	try {
		const db = useDb(event);

		/** 获取未迁移的员工账户 */
		const unmigratedStaff = await db.query.smStaff.findMany({
			where: and(isNull(smStaff.neonAuthId)),
			columns: {
				id: true,
				name: true,
				email: true,
				phone: true,
			},
		});
		const staffAccounts: UnmigratedAccount[] = unmigratedStaff.map((staff) => ({
			id: staff.id,
			name: staff.name,
			email: staff.email || undefined,
			phone: staff.phone || undefined,
			userType: "staff" as const,
		}));

		/** 获取未迁移的业主账户 */
		const unmigratedOwners = await db.query.hpOwners.findMany({
			where: and(isNull(hpOwners.neonAuthId)),
			columns: {
				id: true,
				name: true,
				email: true,
				phone: true,
			},
		});
		const ownerAccounts: UnmigratedAccount[] = unmigratedOwners.map((owner) => ({
			id: owner.id,
			name: owner.name,
			email: owner.email || undefined,
			phone: owner.phone || undefined,
			userType: "owner" as const,
		}));

		const response: JsonVO<UnmigratedAccountsResponse> = {
			success: true,
			code: 200,
			message: "获取成功",
			data: {
				staff: staffAccounts,
				owners: ownerAccounts,
				total: staffAccounts.length + ownerAccounts.length,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[Get Unmigrated Accounts] Error:", error);

		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "获取未迁移账户列表失败",
			data: null,
			error: error.message || String(error),
		};
		return errorResponse;
	}
});
