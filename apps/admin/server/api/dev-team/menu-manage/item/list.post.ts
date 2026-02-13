/**
 * @file 菜单项列表接口
 * @description Menu item list API
 * POST /api/dev-team/menu-manage/item/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import type { JsonVO, PageDTO, MenuItemListItem } from "@01s-11comm/type";
import { dtMenuItems } from "@01s-11comm/type";
import { db } from "server/db";
import { and, desc, eq, like, sql } from "drizzle-orm";

const querySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
	menuId: z.string().optional(),
	menuName: z.string().optional(),
	parentMenu: z.string().optional(),
	menuType: z.string().optional(),
	status: z.string().optional(),
	isExternal: z.enum(["true", "false"]).optional(),
	isCached: z.enum(["true", "false"]).optional(),
	isHidden: z.enum(["true", "false"]).optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<MenuItemListItem>>> => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;

		const rawQuery = {
			...body,
			page: (body.page as number) || (body.pageIndex as number) || 1,
			menuId: body.menuId === "" ? undefined : (body.menuId as string | undefined),
			menuName: body.menuName === "" ? undefined : (body.menuName as string | undefined),
			parentMenu: body.parentMenu === "" ? undefined : (body.parentMenu as string | undefined),
			isExternal: body.isExternal === "" ? undefined : (body.isExternal as "true" | "false" | undefined),
			isCached: body.isCached === "" ? undefined : (body.isCached as "true" | "false" | undefined),
			isHidden: body.isHidden === "" ? undefined : (body.isHidden as "true" | "false" | undefined),
		};

		const query = querySchema.parse(rawQuery);

		const conditions = [];

		if (query.menuId) {
			conditions.push(eq(dtMenuItems.id, query.menuId));
		}

		if (query.menuName) {
			conditions.push(like(dtMenuItems.menuName, `%${query.menuName}%`));
		}

		if (query.parentMenu) {
			conditions.push(eq(dtMenuItems.catalogId, query.parentMenu));
		}

		if (query.isExternal) {
			conditions.push(eq(dtMenuItems.isExternal, query.isExternal === "true"));
		}

		if (query.isCached) {
			conditions.push(eq(dtMenuItems.isCache, query.isCached === "true"));
		}

		if (query.isHidden) {
			conditions.push(eq(dtMenuItems.isVisible, query.isHidden !== "true"));
		}

		const offset = (query.page - 1) * query.pageSize;

		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(dtMenuItems)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		const data = await db
			.select({
				id: dtMenuItems.id,
				catalogId: dtMenuItems.catalogId,
				menuName: dtMenuItems.menuName,
				path: dtMenuItems.path,
				componentPath: dtMenuItems.componentPath,
				menuIcon: dtMenuItems.menuIcon,
				sortOrder: dtMenuItems.sortOrder,
				isVisible: dtMenuItems.isVisible,
				isCache: dtMenuItems.isCache,
				isExternal: dtMenuItems.isExternal,
				createdAt: dtMenuItems.createdAt,
			})
			.from(dtMenuItems)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(dtMenuItems.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		const list: MenuItemListItem[] = data.map((item) => ({
			menuId: item.id,
			menuName: item.menuName,
			parentMenu: item.catalogId ?? "",
			menuType: "menu",
			routePath: item.path,
			componentPath: item.componentPath ?? "",
			permissionKey: item.path,
			sortNo: item.sortOrder ?? 0,
			status: "enabled",
			isExternal: item.isExternal ? "true" : "false",
			isCached: item.isCache ? "true" : "false",
			isHidden: item.isVisible ? "false" : "true",
			createTime: item.createdAt ? item.createdAt.toISOString() : "",
			icon: item.menuIcon ?? "",
		}));

		const response: JsonVO<PageDTO<MenuItemListItem>> = {
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
