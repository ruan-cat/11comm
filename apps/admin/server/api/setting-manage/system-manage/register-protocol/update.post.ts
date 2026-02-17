/**
 * @file 系统管理-注册协议-更新注册协议接口
 * @description Register protocol update API
 * POST /api/setting-manage/system-manage/register-protocol/update
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { smRegisterProtocols, updateSmRegisterProtocolSchema } from "@01s-11comm/type";
import type { JsonVO, SmRegisterProtocolListItem } from "@01s-11comm/type";
import { eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

export default defineHandler(async (event): Promise<JsonVO<SmRegisterProtocolListItem>> => {
	try {
		const body = (await readValidatedBody(event, updateSmRegisterProtocolSchema.parse)) as any;

		/** 提取 id 和更新数据 */
		const { id, ...updateData } = body;

		/** 更新数据 */
		const [updatedRecord] = await db
			.update(smRegisterProtocols)
			.set(updateData)
			.where(eq(smRegisterProtocols.id, id))
			.returning();

		if (!updatedRecord) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "记录不存在",
				data: null,
			};
			return errorResponse;
		}

		/** 映射时间字段 Date -> string */
		const responseData: SmRegisterProtocolListItem = {
			...updatedRecord,
			createTime: updatedRecord.createdAt ? formatDateTime(updatedRecord.createdAt) : "",
			updateTime: updatedRecord.updatedAt ? formatDateTime(updatedRecord.updatedAt) : "",
		};

		const response: JsonVO<SmRegisterProtocolListItem> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: responseData,
		};
		return response;
	} catch (error: any) {
		console.error("[Register Protocol Update] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "更新失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
