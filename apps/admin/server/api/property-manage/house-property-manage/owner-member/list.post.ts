/**
 * @file Owner Member 列表接口
 * @description Owner Member list API
 * POST /api/property-manage/house-property-manage/owner-member/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { hpOwnerMembers } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { OwnerMemberListItem, OwnerMemberQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	name: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OwnerMemberListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			name: body.name === "" ? undefined : body.name,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.name) {
			conditions.push(like(hpOwnerMembers.name, `%${query.name}%`));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: hpOwnerMembers.createdAt,
			updatedAt: hpOwnerMembers.updatedAt,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(hpOwnerMembers)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: hpOwnerMembers.id,
				ownerId: hpOwnerMembers.ownerId,
				name: hpOwnerMembers.name,
				gender: hpOwnerMembers.gender,
				memberType: hpOwnerMembers.memberType,
				idCard: hpOwnerMembers.idCard,
				phone: hpOwnerMembers.phone,
				homeAddress: hpOwnerMembers.homeAddress,
				facePhotoUrl: hpOwnerMembers.facePhotoUrl,
				accessKey: hpOwnerMembers.accessKey,
				remark: hpOwnerMembers.remark,
				createdAt: hpOwnerMembers.createdAt,
				updatedAt: hpOwnerMembers.updatedAt,
			})
			.from(hpOwnerMembers)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: OwnerMemberListItem[] = data.map((item) => ({
			id: item.id,
			memberFace: item.facePhotoUrl || "",
			name: item.name || "",
			gender: item.gender || "",
			type: item.memberType || "",
			idCard: item.idCard || "",
			contact: item.phone || "",
			homeAddress: item.homeAddress || "",
			accessKey: item.accessKey || "",
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
			remark: item.remark || "",
			relation: item.memberType || "",
			phone: item.phone || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<OwnerMemberListItem>> = {
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
		console.error("[Owner Member List] Error:", error);
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
