/**
 * @file 系统管理-小区配置-删除小区配置接口
 * @description Community configuration delete API
 * POST /api/setting-manage/system-manage/community-configuration/delete
 */

import { defineHandler, readBody } from "nitro/h3";
import { db } from "server/db";
import { smCommunityConfigurations } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event): Promise<JsonVO<null>> => {
	try {
		const body = await readBody(event);
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
		const result = await db.delete(smCommunityConfigurations).where(eq(smCommunityConfigurations.id, id)).returning();

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
		console.error("[Community Configuration Delete] Error:", error);
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
