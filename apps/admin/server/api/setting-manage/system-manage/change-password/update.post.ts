/**
 * @file 系统管理-密码修改记录-更新密码修改记录接口
 * @description Change password record update API
 * POST /api/setting-manage/system-manage/change-password/update
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { smChangePasswordRecords, updateSmChangePasswordRecordSchema } from "@01s-11comm/type";
import type { SmChangePasswordRecord, JsonVO } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";
import { eq } from "drizzle-orm";

export default defineHandler(async (event): Promise<JsonVO<SmChangePasswordRecord>> => {
	try {
		const body = await readValidatedBody(event, updateSmChangePasswordRecordSchema.parse);
		const { id, ...updateData } = body;

		/** 更新数据 */
		const [updatedRecord] = await db
			.update(smChangePasswordRecords)
			.set(updateData)
			.where(eq(smChangePasswordRecords.id, id))
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
		const responseData: SmChangePasswordRecord = {
			...updatedRecord,
			createdAt: formatDateTime(updatedRecord.createdAt),
			updatedAt: formatDateTime(updatedRecord.updatedAt),
		};

		const response: JsonVO<SmChangePasswordRecord> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: responseData,
		};
		return response;
	} catch (error: any) {
		console.error("[Change Password Record Update] Error:", error);
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
