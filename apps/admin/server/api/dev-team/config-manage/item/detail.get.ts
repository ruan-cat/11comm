/**
 * 配置项详情 API
 * @description 获取配置项详情数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigItems, dtConfigTypes } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

// 查询参数验证 schema
const querySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	// 1. 获取并验证查询参数
	const rawQuery = getQuery(event);
	const query = querySchema.parse(rawQuery);

	// 2. 查询详情数据 - 关联配置类型表
	const [configItem] = await db
		.select({
			id: dtConfigItems.id,
			itemName: dtConfigItems.itemName,
			itemKey: dtConfigItems.itemKey,
			typeId: dtConfigItems.typeId,
			dataType: dtConfigItems.dataType,
			validationRule: dtConfigItems.validationRule,
			createdAt: dtConfigItems.createdAt,
			updatedAt: dtConfigItems.updatedAt,
			// 关联配置类型信息
			typeName: dtConfigTypes.typeName,
			typeCode: dtConfigTypes.typeCode,
		})
		.from(dtConfigItems)
		.leftJoin(dtConfigTypes, eq(dtConfigItems.typeId, dtConfigTypes.id))
		.where(eq(dtConfigItems.id, query.id))
		.limit(1);

	// 3. 检查是否找到记录
	if (!configItem) {
		return {
			code: 404,
			msg: "配置项不存在",
			data: null,
		};
	}

	// 4. 返回标准响应格式
	return {
		code: 200,
		msg: "查询成功",
		data: configItem,
	};
});
