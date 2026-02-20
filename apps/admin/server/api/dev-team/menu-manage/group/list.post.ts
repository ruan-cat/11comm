/**
 * @file 菜单组列表接口
 * @description Menu group list API
 * POST /api/dev-team/menu-manage/group/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import type { JsonVO, PageDTO, MenuGroupListItem } from "@01s-11comm/type";
import { dtMenuGroups } from "@01s-11comm/type";
import { useDb } from "server/db";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

const querySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
	groupId: z.string().optional(),
	groupName: z.string().optional(),
	groupCode: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<MenuGroupListItem>>> => {
	const db = useDb(event);
	try {
		const body = (await readBody(event)) as Record<string, unknown>;

		const rawQuery = {
			...body,
			page: (body.page as number) || (body.pageIndex as number) || 1,
			groupId: body.groupId === "" ? undefined : (body.groupId as string | undefined),
			groupName: body.groupName === "" ? undefined : (body.groupName as string | undefined),
			groupCode: body.groupCode === "" ? undefined : (body.groupCode as string | undefined),
		};

		const query = querySchema.parse(rawQuery);

		const conditions = [];

		if (query.groupId) {
			conditions.push(eq(dtMenuGroups.id, query.groupId));
		}

		if (query.groupName) {
			conditions.push(like(dtMenuGroups.groupName, `%${query.groupName}%`));
		}

		if (query.groupCode) {
			conditions.push(like(dtMenuGroups.groupCode, `%${query.groupCode}%`));
		}

		const offset = (query.page - 1) * query.pageSize;

		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(dtMenuGroups)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		const data = await db
			.select({
				id: dtMenuGroups.id,
				groupName: dtMenuGroups.groupName,
				groupCode: dtMenuGroups.groupCode,
				groupIcon: dtMenuGroups.groupIcon,
				sortOrder: dtMenuGroups.sortOrder,
				createTime: dtMenuGroups.createTime,
				updateTime: dtMenuGroups.updateTime,
			})
			.from(dtMenuGroups)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(dtMenuGroups.createTime))
			.limit(query.pageSize)
			.offset(offset);

		const list: MenuGroupListItem[] = data.map((item) => ({
			groupId: item.id,
			groupName: item.groupName,
			groupCode: item.groupCode,
			groupType: "system",
			storeName: "",
			sortNo: item.sortOrder ?? 0,
			icon: item.groupIcon ?? "",
			status: "enabled",
			description: "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
		}));

		const response: JsonVO<PageDTO<MenuGroupListItem>> = {
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
