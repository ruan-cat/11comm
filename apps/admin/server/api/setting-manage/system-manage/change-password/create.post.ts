/**
 * @file 系统管理-密码修改记录-创建密码修改记录接口
 * @description Change password record create API
 * POST /api/setting-manage/system-manage/change-password/create
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { smChangePasswordRecords, insertSmChangePasswordRecordSchema } from "@01s-11comm/type";
import type { NewSmChangePasswordRecord, SmChangePasswordRecord, JsonVO } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

export default defineHandler(async (event): Promise<JsonVO<SmChangePasswordRecord>> => {
	try {
		const body = (await readValidatedBody(
			event,
			insertSmChangePasswordRecordSchema.parse,
		)) as unknown as NewSmChangePasswordRecord;

		const [newRecord] = await db.insert(smChangePasswordRecords).values(body).returning();

		/** 映射时间字段 Date -> string */
		const responseData: SmChangePasswordRecord = {
			...newRecord,
			createdAt: formatDateTime(newRecord.createdAt),
			updatedAt: formatDateTime(newRecord.updatedAt),
		};

		const response: JsonVO<SmChangePasswordRecord> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: responseData,
		};
		return response;
	} catch (error: any) {
		console.error("[Change Password Record Create] Error:", error);
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
