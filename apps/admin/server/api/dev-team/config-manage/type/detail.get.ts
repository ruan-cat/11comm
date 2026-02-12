/**
 * 配置类型详情 API
 * @description 获取配置类型详情数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigTypes } from "@01s-11comm/type";
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
	const [configType] = await db
		.select({
			id: dtConfigTypes.id,
			typeName: dtConfigTypes.typeName,
			typeCode: dtConfigTypes.typeCode,
			typeDescription: dtConfigTypes.typeDescription,
			sortOrder: dtConfigTypes.sortOrder,
			createdAt: dtConfigTypes.createdAt,
			updatedAt: dtConfigTypes.updatedAt,
		})
		.from(dtConfigTypes)
		.where(eq(dtConfigTypes.id, query.id))
		.limit(1);

	// 3. 检查是否找到记录
	if (!configType) {
		return {
			code: 404,
			msg: "配置类型不存在",
			data: null,
		};
	}

	// 4. 返回标准响应格式
	return {
		code: 200,
		msg: "查询成功",
		data: configType,
	};
});
