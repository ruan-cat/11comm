/**
 * @file 系统管理-密码修改记录-删除密码修改记录接口
 * @description Change password record delete API
 * POST /api/setting-manage/system-manage/change-password/delete
 */

import { defineHandler, readBody } from "nitro/h3";
import { db } from "server/db";
import { smChangePasswordRecords } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event): Promise<JsonVO<null>> => {
	try {
		const body = (await readBody(event)) as any;
		const { id } = body;

		if (!id) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 400,
				message: "缺少必要参数",
				data: null,
			};
			return errorResponse;
		}

		/** 删除数据 */
		const result = await db.delete(smChangePasswordRecords).where(eq(smChangePasswordRecords.id, id)).returning();

		if (!result[0]) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "记录不存在",
				data: null,
			};
			return errorResponse;
		}

		const response: JsonVO<null> = {
			success: true,
			code: 200,
			message: "删除成功",
			data: null,
		};
		return response;
	} catch (error: any) {
		console.error("[Change Password Record Delete] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "删除失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
