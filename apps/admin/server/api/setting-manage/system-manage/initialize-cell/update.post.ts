/**
 * @file 系统管理-初始化小区-更新初始化小区接口
 * @description Initialize cell update API
 * POST /api/setting-manage/system-manage/initialize-cell/update
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { smInitializeCells } from "@01s-11comm/type";
import { updateSmInitializeCellSchema, type SmInitializeCellVO } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

export default defineHandler(async (event): Promise<JsonVO<SmInitializeCellVO>> => {
	const db = useDb(event);
	try {
		const body = (await readValidatedBody(event, updateSmInitializeCellSchema.parse)) as unknown as Parameters<
			typeof updateSmInitializeCellSchema.parse
		>[0];

		/** 验证数据 */
		const validatedData = updateSmInitializeCellSchema.parse(body);
		const { id, ...updateData } = validatedData;

		/** 更新数据 */
		const result = await db.update(smInitializeCells).set(updateData).where(eq(smInitializeCells.id, id)).returning();

		if (!result[0]) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "记录不存在",
				data: null,
			};
			return errorResponse;
		}

		/** 映射 createTime/updateTime (Date -> string) */
		const mappedData: SmInitializeCellVO = {
			...result[0],
			createTime: formatDateTime(result[0].createTime),
			updateTime: formatDateTime(result[0].updateTime),
		};

		const response: JsonVO<SmInitializeCellVO> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: mappedData,
		};
		return response;
	} catch (error: any) {
		console.error("[Initialize Cell Update] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "更新失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
