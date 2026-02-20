/**
 * @file 系统管理-小区配置-更新小区配置接口
 * @description Community configuration update API
 * POST /api/setting-manage/system-manage/community-configuration/update
 */

import { defineHandler, readBody } from "nitro/h3";
import { useDb } from "server/db";
import { smCommunityConfigurations, updateSmCommunityConfigurationSchema } from "@01s-11comm/type";
import type { JsonVO, SmCommunityConfiguration } from "@01s-11comm/type";
import { eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

export default defineHandler(async (event): Promise<JsonVO<SmCommunityConfiguration>> => {
	const db = useDb(event);
	try {
		const body = await readBody(event);

		/** 验证数据 */
		const validatedData = updateSmCommunityConfigurationSchema.parse(body);
		const { id, updateTime, ...updateData } = validatedData;

		/** 更新数据 */
		const result = await db
			.update(smCommunityConfigurations)
			.set(updateData)
			.where(eq(smCommunityConfigurations.id, id))
			.returning();

		if (!result[0]) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "记录不存在",
				data: null,
			};
			return errorResponse;
		}

		const response: JsonVO<SmCommunityConfiguration> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: {
				...result[0],
				createTime: result[0].createTime ? formatDateTime(result[0].createTime) : null,
				updateTime: result[0].updateTime ? formatDateTime(result[0].updateTime) : null,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[Community Configuration Update] Error:", error);
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
