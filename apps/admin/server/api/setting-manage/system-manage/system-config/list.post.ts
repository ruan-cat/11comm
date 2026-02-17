/**
 * @file 系统配置列表接口
 * @description System config list API
 * POST /api/setting-manage/system-manage/system-config/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { smSystemConfigs } from "@01s-11comm/type";
import type { JsonVO, PageDTO, SystemConfigListItem, SystemConfigQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<SystemConfigListItem>>> => {
	try {
		const body = (await readBody(event)) as any;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 查询总数
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(smSystemConfigs);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await db
			.select({
				id: smSystemConfigs.id,
				configKey: smSystemConfigs.configKey,
				configValue: smSystemConfigs.configValue,
				configType: smSystemConfigs.configType,
				configDescription: smSystemConfigs.configDescription,
				status: smSystemConfigs.status,
				createdAt: smSystemConfigs.createdAt,
				updatedAt: smSystemConfigs.updatedAt,
			})
			.from(smSystemConfigs)
			.orderBy(desc(smSystemConfigs.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		// 映射到前端类型 - 数据库表字段与前端类型字段不一致，需要适配
		const list: SystemConfigListItem[] = data.map((item) => ({
			id: item.id,
			configId: item.id || "",
			title: item.configKey || "",
			subtitle: item.configDescription || "",
			shortName: "",
			companyName: "",
			logoUrl: "",
			staticUrl: "",
			defaultCommunityCode: "",
			ownerTitle: "",
			propertyMobileTitle: "",
			qqMapKey: "",
			mallUrl: "",
			configKey: item.configKey || "",
			configValue: item.configValue || "",
			description: item.configDescription || "",
			category: item.configType || "",
			isSystem: true,
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<SystemConfigListItem>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list,
				total,
				pageSize: query.pageSize,
				pageIndex: query.pageIndex,
				totalPages,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[System Config List] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
