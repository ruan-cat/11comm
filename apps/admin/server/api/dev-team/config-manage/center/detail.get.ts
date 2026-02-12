/**
 * 配置中心详情 API
 * @description 获取配置中心详情数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigs } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

// 查询参数验证 schema
const querySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	// 1. 获取并验证查询参数
	const rawQuery = getQuery(event);
	const query = querySchema.parse(rawQuery);

	// 2. 查询详情数据
	const [config] = await db
		.select({
			id: dtConfigs.id,
			configName: dtConfigs.configName,
			configType: dtConfigs.configType,
			configKey: dtConfigs.configKey,
			configValue: dtConfigs.configValue,
			defaultValue: dtConfigs.defaultValue,
			configDescription: dtConfigs.configDescription,
			status: dtConfigs.status,
			sortOrder: dtConfigs.sortOrder,
			remark: dtConfigs.remark,
			createdAt: dtConfigs.createdAt,
			updatedAt: dtConfigs.updatedAt,
			createdBy: dtConfigs.createdBy,
			updatedBy: dtConfigs.updatedBy,
		})
		.from(dtConfigs)
		.where(eq(dtConfigs.id, query.id))
		.limit(1);

	// 3. 检查是否找到记录
	if (!config) {
		return {
			code: 404,
			msg: "配置中心不存在",
			data: null,
		};
	}

	// 4. 返回标准响应格式
	return {
		code: 200,
		msg: "查询成功",
		data: config,
	};
});
