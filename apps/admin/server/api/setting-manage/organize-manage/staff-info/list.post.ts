/**
 * @file 组织管理-员工信息-员工列表接口
 * @description Staff info list API
 * POST /api/setting-manage/organize-manage/staff-info/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { smStaff, smOrganizations } from "@01s-11comm/type";
import type { JsonVO, PageDTO, StaffInfoListQuery } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	name: z.string().optional(),
	phone: z.string().optional(),
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

		// 关联查询组织表获取组织名称
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(smStaff)
			.leftJoin(smOrganizations, eq(smStaff.orgId, smOrganizations.id));

		const total = Number(countResult[0]?.total || 0);

		const data = await db
			.select({
				id: smStaff.id,
				employeeNumber: smStaff.employeeNumber,
				name: smStaff.name,
				gender: smStaff.gender,
				position: smStaff.position,
				email: smStaff.email,
				phone: smStaff.phone,
				homeAddress: smStaff.homeAddress,
				avatarUrl: smStaff.avatarUrl,
				orgId: smStaff.orgId,
				orgName: smOrganizations.orgName,
				createTime: smStaff.createTime,
				updateTime: smStaff.updateTime,
			})
			.from(smStaff)
			.leftJoin(smOrganizations, eq(smStaff.orgId, smOrganizations.id))
			.orderBy(desc(smStaff.createTime))
			.limit(query.pageSize)
			.offset(offset);

		const list = data.map((item) => ({
			id: item.id,
			employeeNumber: item.employeeNumber || "",
			name: item.name || "",
			gender: item.gender || "",
			position: item.position || "",
			email: item.email || "",
			phone: item.phone || "",
			address: item.homeAddress || "",
			orgId: item.orgId || "",
			orgName: item.orgName || "",
			avatar: item.avatarUrl || "",
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
		console.error("[Staff Info List] Error:", error);
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
