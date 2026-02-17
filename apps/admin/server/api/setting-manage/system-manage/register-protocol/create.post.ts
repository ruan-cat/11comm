/**
 * @file 系统管理-注册协议-创建注册协议接口
 * @description Register protocol create API
 * POST /api/setting-manage/system-manage/register-protocol/create
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { smRegisterProtocols, insertSmRegisterProtocolSchema } from "@01s-11comm/type";
import type { JsonVO, NewSmRegisterProtocol, SmRegisterProtocolListItem } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

export default defineHandler(async (event): Promise<JsonVO<SmRegisterProtocolListItem>> => {
	try {
		const body = (await readValidatedBody(
			event,
			insertSmRegisterProtocolSchema.parse,
		)) as unknown as NewSmRegisterProtocol;

		const [newRecord] = await db.insert(smRegisterProtocols).values(body).returning();

		/** 映射时间字段 Date -> string */
		const responseData: SmRegisterProtocolListItem = {
			...newRecord,
			createTime: newRecord.createdAt ? formatDateTime(newRecord.createdAt) : "",
			updateTime: newRecord.updatedAt ? formatDateTime(newRecord.updatedAt) : "",
		};

		const response: JsonVO<SmRegisterProtocolListItem> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: responseData,
		};
		return response;
	} catch (error: any) {
		console.error("[Register Protocol Create] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "创建失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
