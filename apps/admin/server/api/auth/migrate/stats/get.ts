/**
 * 获取迁移统计 API
 * @description 获取账户迁移统计信息
 */

import { defineHandler } from "nitro/h3";
import { useDb } from "server/db";
import { smStaff, hpOwners } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";

/** 迁移统计响应 */
interface MigrationStatsResponse {
	totalStaff: number;
	migratedStaff: number;
	totalOwners: number;
	migratedOwners: number;
	staffProgress: string;
	ownerProgress: string;
}

export default defineHandler(async (event) => {
	try {
		const db = useDb(event);

		/** 统计员工账户 */
		const allStaff = await db.query.smStaff.findMany({
			columns: {
				neonAuthId: true,
			},
		});
		const migratedStaff = allStaff.filter((s) => s.neonAuthId).length;

		/** 统计业主账户 */
		const allOwners = await db.query.hpOwners.findMany({
			columns: {
				neonAuthId: true,
			},
		});
		const migratedOwners = allOwners.filter((o) => o.neonAuthId).length;

		/** 计算进度百分比 */
		const staffProgress = allStaff.length > 0 ? `${Math.round((migratedStaff / allStaff.length) * 100)}%` : "0%";
		const ownerProgress = allOwners.length > 0 ? `${Math.round((migratedOwners / allOwners.length) * 100)}%` : "0%";

		const response: JsonVO<MigrationStatsResponse> = {
			success: true,
			code: 200,
			message: "获取成功",
			data: {
				totalStaff: allStaff.length,
				migratedStaff,
				totalOwners: allOwners.length,
				migratedOwners,
				staffProgress,
				ownerProgress,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[Get Migration Stats] Error:", error);

		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "获取迁移统计失败",
			data: null,
			error: error.message || String(error),
		};
		return errorResponse;
	}
});
