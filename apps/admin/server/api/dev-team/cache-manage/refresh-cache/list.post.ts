/**
 * @file 刷新缓存列表接口
 * @description Refresh cache list API
 * POST /api/dev-team/cache-manage/refresh-cache/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import type { JsonVO, PageDTO, RefreshCacheListItem } from "@01s-11comm/type";
import { dtCacheConfigs } from "@01s-11comm/type";
import { useDb } from "server/db";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

const querySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
	cacheId: z.string().optional(),
	cacheCode: z.string().optional(),
	cacheName: z.string().optional(),
	cacheKey: z.string().optional(),
	cacheType: z.string().optional(),
	refreshPolicy: z.string().optional(),
});

/** 将数据库查询结果映射为前端列表项 */
function mapDtCacheConfigsToRefreshCacheListItems(
	data: Array<{
		id: string;
		cacheCode: string;
		cacheName: string;
		cacheKey: string;
		cacheType: string | null;
		cacheGroup: string | null;
		expireTime: number | null;
		description: string | null;
		refreshStrategy: string | null;
		status: string | null;
		createTime: Date | null;
		updateTime: Date | null;
	}>,
): RefreshCacheListItem[] {
	return data.map((row) => ({
		cacheId: row.id,
		cacheCode: row.cacheCode,
		cacheName: row.cacheName,
		cacheKey: row.cacheKey,
		cacheType: row.cacheType ?? "",
		cacheGroup: row.cacheGroup ?? "",
		expireTime: row.expireTime ?? 0,
		description: row.description ?? "",
		refreshPolicy: row.refreshStrategy ?? "",
		status: row.status ?? "enabled",
		createTime: row.createTime ? formatDateTime(row.createTime) : "",
		updateTime: row.updateTime ? formatDateTime(row.updateTime) : "",
	}));
}

export default defineHandler(async (event): Promise<JsonVO<PageDTO<RefreshCacheListItem>>> => {
	const db = useDb(event);
	try {
		const body = (await readBody(event)) as Record<string, unknown>;

		const rawQuery = {
			...body,
			page: (body.page as number) || (body.pageIndex as number) || 1,
			cacheId: body.cacheId === "" ? undefined : (body.cacheId as string | undefined),
			cacheCode: body.cacheCode === "" ? undefined : (body.cacheCode as string | undefined),
			cacheName: body.cacheName === "" ? undefined : (body.cacheName as string | undefined),
			cacheKey: body.cacheKey === "" ? undefined : (body.cacheKey as string | undefined),
			cacheType: body.cacheType === "" ? undefined : (body.cacheType as string | undefined),
			refreshPolicy: body.refreshPolicy === "" ? undefined : (body.refreshPolicy as string | undefined),
		};

		const query = querySchema.parse(rawQuery);

		const conditions = [];
		const keyword = query.cacheKey || query.cacheName || query.cacheCode;

		if (query.cacheId) {
			conditions.push(eq(dtCacheConfigs.id, query.cacheId));
		}

		if (keyword) {
			conditions.push(
				or(
					like(dtCacheConfigs.cacheCode, `%${keyword}%`),
					like(dtCacheConfigs.cacheName, `%${keyword}%`),
					like(dtCacheConfigs.cacheKey, `%${keyword}%`),
				),
			);
		}

		if (query.cacheCode) {
			conditions.push(like(dtCacheConfigs.cacheCode, `%${query.cacheCode}%`));
		}

		if (query.cacheName) {
			conditions.push(like(dtCacheConfigs.cacheName, `%${query.cacheName}%`));
		}

		if (query.cacheType) {
			conditions.push(eq(dtCacheConfigs.cacheType, query.cacheType));
		}

		if (query.refreshPolicy) {
			conditions.push(eq(dtCacheConfigs.refreshStrategy, query.refreshPolicy));
		}

		const offset = (query.page - 1) * query.pageSize;

		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(dtCacheConfigs)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		const data = await db
			.select({
				id: dtCacheConfigs.id,
				cacheCode: dtCacheConfigs.cacheCode,
				cacheName: dtCacheConfigs.cacheName,
				cacheKey: dtCacheConfigs.cacheKey,
				cacheType: dtCacheConfigs.cacheType,
				cacheGroup: dtCacheConfigs.cacheGroup,
				expireTime: dtCacheConfigs.expireTime,
				description: dtCacheConfigs.description,
				refreshStrategy: dtCacheConfigs.refreshStrategy,
				status: dtCacheConfigs.status,
				createTime: dtCacheConfigs.createTime,
				updateTime: dtCacheConfigs.updateTime,
			})
			.from(dtCacheConfigs)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(dtCacheConfigs.createTime))
			.limit(query.pageSize)
			.offset(offset);

		const list: RefreshCacheListItem[] = mapDtCacheConfigsToRefreshCacheListItems(data);

		const response: JsonVO<PageDTO<RefreshCacheListItem>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list,
				total,
				pageIndex: query.page,
				pageSize: query.pageSize,
				totalPages: Math.ceil(total / query.pageSize),
			},
		};

		return response;
	} catch (error: any) {
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
