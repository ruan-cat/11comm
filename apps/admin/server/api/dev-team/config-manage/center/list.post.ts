/**
 * 配置中心列表查询 API
 * @description 获取配置中心列表数据
 */

import { defineHandler, readBody } from "nitro/h3";
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
	try {
		// 1. 获取并验证查询参数
		const body = (await readBody(event)) as any;
		console.log("[Config Center List] Raw Body:", body);

		// 预处理参数：
		// 1. 映射 pageIndex -> page
		// 2. 将空字符串转换为 undefined，避免 Zod enum 校验失败或逻辑干扰
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			status: body.status === "" ? undefined : body.status,
			configType: body.configType === "" ? undefined : body.configType,
			configName: body.configName === "" ? undefined : body.configName,
			configKey: body.configKey === "" ? undefined : body.configKey,
		};

		const query = querySchema.parse(rawQuery);
		console.log("[Config Center List] Parsed Query:", query);

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
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list: data,
				total,
				pageSize: query.pageSize,
				currentPage: query.page,
			},
		};
	} catch (error: any) {
		console.error("[Config Center List] Error:", error);
		return {
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
	}
});
