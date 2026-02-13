/**
 * @file 组织管理-数据权限-列表接口
 * @description Data permission list API
 * POST /api/setting-manage/organize-manage/data-permission/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { smDataPermissions, smRoles } from "@01s-11comm/type";
import type { JsonVO, PageDTO, DataPermissionListQuery } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, sql, eq } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	name: z.string().optional(),
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

		// 关联查询角色表获取名称
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(smDataPermissions)
			.leftJoin(smRoles, eq(smDataPermissions.roleId, smRoles.id));

		const total = Number(countResult[0]?.total || 0);

		const data = await db
			.select({
				id: smDataPermissions.id,
				roleId: smDataPermissions.roleId,
				roleName: smRoles.roleName,
				scope: smDataPermissions.scope,
				permissionRule: smDataPermissions.permissionRule,
				dataFilter: smDataPermissions.dataFilter,
				createdAt: smDataPermissions.createdAt,
				updatedAt: smDataPermissions.updatedAt,
			})
			.from(smDataPermissions)
			.leftJoin(smRoles, eq(smDataPermissions.roleId, smRoles.id))
			.orderBy(desc(smDataPermissions.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		const list = data.map((item) => ({
			id: item.id,
			roleId: item.roleId || "",
			name: item.roleName || "",
			scope: item.scope || "",
			permissionRule: item.permissionRule || "",
			dataFilter: item.dataFilter,
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
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
		console.error("[Data Permission List] Error:", error);
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
