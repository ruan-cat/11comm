/**
 * @file 系统管理-初始化小区-创建初始化小区接口
 * @description Initialize cell create API
 * POST /api/setting-manage/system-manage/initialize-cell/create
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { smInitializeCells } from "@01s-11comm/type";
import { insertSmInitializeCellSchema, type NewSmInitializeCell, type SmInitializeCellVO } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

export default defineHandler(async (event): Promise<JsonVO<SmInitializeCellVO>> => {
	try {
		const body = (await readValidatedBody(event, insertSmInitializeCellSchema.parse)) as unknown as NewSmInitializeCell;

		/** 验证并插入数据 */
		const result = await db.insert(smInitializeCells).values(body).returning();

		/** 映射 createTime/updateTime (Date -> string) */
		const mappedData: SmInitializeCellVO = {
			...result[0],
			createTime: formatDateTime(result[0].createTime),
			updateTime: formatDateTime(result[0].updateTime),
		};

		const response: JsonVO<SmInitializeCellVO> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: mappedData,
		};
		return response;
	} catch (error: any) {
		console.error("[Initialize Cell Create] Error:", error);
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
