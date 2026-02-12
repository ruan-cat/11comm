/**
 * 配置项列表查询 API
 * @description 获取配置项列表数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigItems, dtConfigTypes } from "@01s-11comm/type";
import { and, desc, eq, like, asc, sql } from "drizzle-orm";

// 查询参数验证 schema
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	itemName: z.string().optional(),
	itemKey: z.string().optional(),
	typeId: z.string().uuid().optional(),
	dataType: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt", "itemName", "itemKey", "typeId"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
	// 1. 获取并验证查询参数
	const rawQuery = getQuery(event);
	const query = querySchema.parse(rawQuery);

	// 2. 构建查询条件
	const conditions = [];

	if (query.itemName) {
		conditions.push(like(dtConfigItems.itemName, `%${query.itemName}%`));
	}

	if (query.itemKey) {
		conditions.push(like(dtConfigItems.itemKey, `%${query.itemKey}%`));
	}

	if (query.typeId) {
		conditions.push(eq(dtConfigItems.typeId, query.typeId));
	}

	if (query.dataType) {
		conditions.push(eq(dtConfigItems.dataType, query.dataType));
	}

	// 3. 计算分页参数
	const offset = (query.page - 1) * query.pageSize;

	// 4. 构建排序条件
	const sortBy = query.sortBy || "createdAt";
	const sortOrder = query.sortOrder || "desc";

	// 获取排序字段
	const sortFields = {
		createdAt: dtConfigItems.createdAt,
		updatedAt: dtConfigItems.updatedAt,
		itemName: dtConfigItems.itemName,
		itemKey: dtConfigItems.itemKey,
		typeId: dtConfigItems.typeId,
	};

	const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

	// 5. 查询总数
	const [countResult] = await db
		.select({ total: sql<number>`count(*)` })
		.from(dtConfigItems)
		.where(conditions.length > 0 ? and(...conditions) : undefined);

	const total = countResult?.total || 0;

	// 6. 查询分页数据 - 关联配置类型表获取更多信息
	const data = await db
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
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(orderBy)
		.limit(query.pageSize)
		.offset(offset);

	// 7. 返回标准响应格式
	return {
		code: 200,
		msg: "查询成功",
		data: {
			list: data,
			total,
			pageSize: query.pageSize,
			currentPage: query.page,
		},
	};
});
