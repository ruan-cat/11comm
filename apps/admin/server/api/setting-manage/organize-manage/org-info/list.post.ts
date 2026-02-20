/**
 * @file 组织管理-组织信息-列表接口
 * @description Organization info list API
 * POST /api/setting-manage/organize-manage/org-info/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { smOrganizations } from "@01s-11comm/type";
import type { JsonVO, PageDTO, OrganizationListQuery } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	keyword: z.string().optional(),
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

		const db = useDb(event);

		// 构建查询条件
		const conditions = [];
		if (query.keyword) {
			conditions.push(like(smOrganizations.orgName, `%${query.keyword}%`));
		}

		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(smOrganizations)
			.where(query.keyword ? like(smOrganizations.orgName, `%${query.keyword}%`) : undefined);

		const total = Number(countResult[0]?.total || 0);

		const data = await db
			.select({
				id: smOrganizations.id,
				orgName: smOrganizations.orgName,
				orgCode: smOrganizations.orgCode,
				orgType: smOrganizations.orgType,
				sortOrder: smOrganizations.sortOrder,
				parentId: smOrganizations.parentId,
				remark: smOrganizations.remark,
				createTime: smOrganizations.createTime,
				updateTime: smOrganizations.updateTime,
			})
			.from(smOrganizations)
			.where(query.keyword ? like(smOrganizations.orgName, `%${query.keyword}%`) : undefined)
			.orderBy(desc(smOrganizations.createTime))
			.limit(query.pageSize)
			.offset(offset);

		const list = data.map((item) => ({
			id: item.id,
			name: item.orgName || "",
			code: item.orgCode || "",
			type: item.orgType || "",
			sort: item.sortOrder || 0,
			parentId: item.parentId || "",
			remark: item.remark || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
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
		console.error("[Org Info List] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
