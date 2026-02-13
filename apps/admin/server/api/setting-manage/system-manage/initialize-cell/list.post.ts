/**
 * @file 系统管理-初始化小区-初始化小区列表接口
 * @description Initialize community list API
 * POST /api/setting-manage/system-manage/initialize-cell/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { smInitializeCells } from "@01s-11comm/type";
import type { JsonVO, PageDTO, InitializeCommunityListItem, InitializeCommunityQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, sql } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	communityId: z.string().optional(),
	communityName: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<InitializeCommunityListItem>>> => {
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
			.from(smInitializeCells);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await db
			.select({
				id: smInitializeCells.id,
				initItem: smInitializeCells.initItem,
				initStatus: smInitializeCells.initStatus,
				configParams: smInitializeCells.configParams,
				createdAt: smInitializeCells.createdAt,
				updatedAt: smInitializeCells.updatedAt,
			})
			.from(smInitializeCells)
			.orderBy(desc(smInitializeCells.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		// 映射到前端类型 - 数据库表字段与前端类型字段不一致，需要适配
		const list: InitializeCommunityListItem[] = data.map((item) => ({
			id: item.id,
			communityId: item.id || "",
			communityName: item.initItem || "",
			nearbyLandmark: "",
			cityCode: "",
			status: item.initStatus || "",
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<InitializeCommunityListItem>> = {
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
		console.error("[Initialize Cell List] Error:", error);
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
