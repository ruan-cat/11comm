/**
 * @file 菜单目录列表接口
 * @description Menu catalog list API
 * POST /api/dev-team/menu-manage/catalog/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import type { JsonVO, PageDTO, MenuCatalogListItem } from "@01s-11comm/type";
import { dtMenuCatalogs } from "@01s-11comm/type";
import { db } from "server/db";
import { and, desc, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

const querySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
	name: z.string().optional(),
	storeType: z.string().optional(),
	groupType: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<MenuCatalogListItem>>> => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;

		const rawQuery = {
			...body,
			page: (body.page as number) || (body.pageIndex as number) || 1,
			name: body.name === "" ? undefined : (body.name as string | undefined),
		};

		const query = querySchema.parse(rawQuery);

		const conditions = [];

		if (query.name) {
			conditions.push(like(dtMenuCatalogs.catalogName, `%${query.name}%`));
		}

		const offset = (query.page - 1) * query.pageSize;

		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(dtMenuCatalogs)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		const data = await db
			.select({
				id: dtMenuCatalogs.id,
				groupId: dtMenuCatalogs.groupId,
				catalogName: dtMenuCatalogs.catalogName,
				catalogIcon: dtMenuCatalogs.catalogIcon,
				sortOrder: dtMenuCatalogs.sortOrder,
				createTime: dtMenuCatalogs.createTime,
				updateTime: dtMenuCatalogs.updateTime,
			})
			.from(dtMenuCatalogs)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(dtMenuCatalogs.createTime))
			.limit(query.pageSize)
			.offset(offset);

		const list: MenuCatalogListItem[] = data.map((item) => ({
			gid: item.groupId ?? "",
			groupType: "system",
			icon: item.catalogIcon ?? "",
			label: item.catalogName,
			name: item.catalogName,
			seq: String(item.sortOrder ?? 0),
			storeType: "property",
			typeText: "",
			storeTypeText: "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
		}));

		const response: JsonVO<PageDTO<MenuCatalogListItem>> = {
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
