/**
 * @file 系统管理-系统配置-创建系统配置接口
 * @description System config create API
 * POST /api/setting-manage/system-manage/system-config/create
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { smSystemConfigs } from "@01s-11comm/type";
import { insertSmSystemConfigSchema, type NewSmSystemConfig, type SmSystemConfigVO } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

export default defineHandler(async (event): Promise<JsonVO<SmSystemConfigVO>> => {
	const db = useDb(event);
	try {
		const body = (await readValidatedBody(event, insertSmSystemConfigSchema.parse)) as unknown as NewSmSystemConfig;

		/** 验证并插入数据 */
		const result = await db.insert(smSystemConfigs).values(body).returning();

		/** 映射 createTime/updateTime (Date -> string) */
		const mappedData: SmSystemConfigVO = {
			...result[0],
			createTime: formatDateTime(result[0].createTime),
			updateTime: formatDateTime(result[0].updateTime),
		};

		const response: JsonVO<SmSystemConfigVO> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: mappedData,
		};
		return response;
	} catch (error: any) {
		console.error("[System Config Create] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "创建失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
