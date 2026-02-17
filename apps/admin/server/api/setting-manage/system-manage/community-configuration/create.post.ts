/**
 * @file 系统管理-小区配置-创建小区配置接口
 * @description Community configuration create API
 * POST /api/setting-manage/system-manage/community-configuration/create
 */

import { defineHandler, readBody } from "nitro/h3";
import { db } from "server/db";
import { smCommunityConfigurations, insertSmCommunityConfigurationSchema } from "@01s-11comm/type";
import type { JsonVO, NewSmCommunityConfiguration } from "@01s-11comm/type";

export default defineHandler(async (event): Promise<JsonVO<NewSmCommunityConfiguration>> => {
	try {
		const body = await readBody(event);

		/** 验证并插入数据 */
		const validatedData = insertSmCommunityConfigurationSchema.parse(body);

		// 移除 createTime/updateTime 字段，因 Schema 定义中这些字段为 varchar 类型
		const { createTime, updateTime, ...insertData } = validatedData;

		const result = await db
			.insert(smCommunityConfigurations)
			.values({ ...insertData } as any)
			.returning();

		const response: JsonVO<NewSmCommunityConfiguration> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: result[0],
		};
		return response;
	} catch (error: any) {
		console.error("[Community Configuration Create] Error:", error);
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
