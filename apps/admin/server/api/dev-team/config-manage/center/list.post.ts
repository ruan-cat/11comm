/**
 * 配置中心列表查询 API
 * @description 获取配置中心列表数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigs } from "@01s-11comm/type";
import { and, desc, eq, like, asc, sql } from "drizzle-orm";

// 查询参数验证 schema
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	configName: z.string().optional(),
	configType: z.string().optional(),
	configKey: z.string().optional(),
	status: z.enum(["enabled", "disabled"]).optional(),
	sortBy: z.enum(["createdAt", "updatedAt", "configName", "configKey", "sortOrder"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
	// 1. 获取并验证查询参数
	const rawQuery = getQuery(event);
	const query = querySchema.parse(rawQuery);

	// 2. 构建查询条件
	const conditions = [];

	if (query.configName) {
		conditions.push(like(dtConfigs.configName, `%${query.configName}%`));
	}

	if (query.configKey) {
		conditions.push(like(dtConfigs.configKey, `%${query.configKey}%`));
	}

	if (query.configType) {
		conditions.push(eq(dtConfigs.configType, query.configType));
	}

	if (query.status) {
		conditions.push(eq(dtConfigs.status, query.status));
	}

	// 3. 计算分页参数
	const offset = (query.page - 1) * query.pageSize;

	// 4. 构建排序条件
	const sortBy = query.sortBy || "createdAt";
	const sortOrder = query.sortOrder || "desc";

	// 获取排序字段
	const sortFields = {
		createdAt: dtConfigs.createdAt,
		updatedAt: dtConfigs.updatedAt,
		configName: dtConfigs.configName,
		configKey: dtConfigs.configKey,
		sortOrder: dtConfigs.sortOrder,
	};

	const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

	// 5. 查询总数
	const [countResult] = await db
		.select({ total: sql<number>`count(*)` })
		.from(dtConfigs)
		.where(conditions.length > 0 ? and(...conditions) : undefined);

	const total = countResult?.total || 0;

	// 6. 查询分页数据
	const data = await db
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
