/**
 * @file 组织管理-角色权限-列表接口
 * @description Role permission list API
 * POST /api/setting-manage/organize-manage/role-permission/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { smRoles } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	name: z.string().optional(),
	code: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		const body = (await readBody(event)) as any;
		const rawQuery = {
			page: body.pageIndex || body.page || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.page - 1) * query.pageSize;

		// 构建查询条件
		const conditions = [];
		if (query.name) {
			conditions.push(like(smRoles.roleName, `%${query.name}%`));
		}
		if (query.code) {
			conditions.push(like(smRoles.code, `%${query.code}%`));
		}

		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(smRoles);

		const total = Number(countResult[0]?.total || 0);

		const data = await db
			.select({
				id: smRoles.id,
				roleName: smRoles.roleName,
				code: smRoles.code,
				description: smRoles.description,
				isEnabled: smRoles.isEnabled,
				createdAt: smRoles.createdAt,
				updatedAt: smRoles.updatedAt,
			})
			.from(smRoles)
			.where(conditions.length > 0 ? like(smRoles.roleName, `%${query.name || ""}%`) : undefined)
			.orderBy(desc(smRoles.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		const list = data.map((item) => ({
			id: item.id,
			name: item.roleName || "",
			code: item.code || "",
			description: item.description || "",
			enabled: item.isEnabled ?? true,
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<any>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list,
				total,
				pageSize: query.pageSize,
				pageIndex: query.page,
				totalPages,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[Role Permission List] Error:", error);
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
