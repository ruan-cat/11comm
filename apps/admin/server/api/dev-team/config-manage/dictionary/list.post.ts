/**
 * 字典列表查询 API
 * @description 获取字典列表数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtDictionaries } from "@01s-11comm/type";
import { and, desc, eq, like, asc, sql } from "drizzle-orm";

// 查询参数验证 schema
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	dictionaryName: z.string().optional(),
	dictionaryCode: z.string().optional(),
	dictionaryType: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt", "dictionaryName", "dictionaryCode"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
	// 1. 获取并验证查询参数
	const rawQuery = getQuery(event);
	const query = querySchema.parse(rawQuery);

	// 2. 构建查询条件
	const conditions = [];

	if (query.dictionaryName) {
		conditions.push(like(dtDictionaries.dictionaryName, `%${query.dictionaryName}%`));
	}

	if (query.dictionaryCode) {
		conditions.push(like(dtDictionaries.dictionaryCode, `%${query.dictionaryCode}%`));
	}

	if (query.dictionaryType) {
		conditions.push(eq(dtDictionaries.dictionaryType, query.dictionaryType));
	}

	// 3. 计算分页参数
	const offset = (query.page - 1) * query.pageSize;

	// 4. 构建排序条件
	const sortBy = query.sortBy || "createdAt";
	const sortOrder = query.sortOrder || "desc";

	// 获取排序字段
	const sortFields = {
		createdAt: dtDictionaries.createdAt,
		updatedAt: dtDictionaries.updatedAt,
		dictionaryName: dtDictionaries.dictionaryName,
		dictionaryCode: dtDictionaries.dictionaryCode,
	};

	const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

	// 5. 查询总数
	const [countResult] = await db
		.select({ total: sql<number>`count(*)` })
		.from(dtDictionaries)
		.where(conditions.length > 0 ? and(...conditions) : undefined);

	const total = countResult?.total || 0;

	// 6. 查询分页数据
	const data = await db
		.select({
			id: dtDictionaries.id,
			dictionaryName: dtDictionaries.dictionaryName,
			dictionaryCode: dtDictionaries.dictionaryCode,
			dictionaryType: dtDictionaries.dictionaryType,
			dictionaryDescription: dtDictionaries.dictionaryDescription,
			remark: dtDictionaries.remark,
			createdAt: dtDictionaries.createdAt,
			updatedAt: dtDictionaries.updatedAt,
		})
		.from(dtDictionaries)
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
