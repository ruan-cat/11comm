/**
 * @file 系统管理-注册协议-删除注册协议接口
 * @description Register protocol delete API
 * POST /api/setting-manage/system-manage/register-protocol/delete
 */

import { defineHandler, readBody } from "nitro/h3";
import { useDb } from "server/db";
import { smRegisterProtocols } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event): Promise<JsonVO<null>> => {
	const db = useDb(event);
	try {
		const body = (await readBody(event)) as { id?: string };
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
		const result = await db.delete(smRegisterProtocols).where(eq(smRegisterProtocols.id, id)).returning();

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
		console.error("[Register Protocol Delete] Error:", error);
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
