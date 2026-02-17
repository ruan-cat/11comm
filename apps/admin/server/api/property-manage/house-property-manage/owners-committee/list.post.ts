/**
 * @file Owners Committee 列表接口
 * @description Owners Committee list API
 * POST /api/property-manage/house-property-manage/owners-committee/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { hpOwnersCommittees } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { OwnersCommitteeListItem, OwnersCommitteeQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	committeeName: z.string().optional(),
	term: z.string().optional(),
	chairman: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OwnersCommitteeListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			committeeName: body.committeeName === "" ? undefined : body.committeeName,
			term: body.term === "" ? undefined : body.term,
			chairman: body.chairman === "" ? undefined : body.chairman,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.committeeName) {
			conditions.push(like(hpOwnersCommittees.committeeName, `%${query.committeeName}%`));
		}

		if (query.term) {
			conditions.push(like(hpOwnersCommittees.term, `%${query.term}%`));
		}

		if (query.chairman) {
			conditions.push(like(hpOwnersCommittees.chairman, `%${query.chairman}%`));
		}

		if (query.status) {
			conditions.push(eq(hpOwnersCommittees.status, query.status as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: hpOwnersCommittees.createdAt,
			updatedAt: hpOwnersCommittees.updatedAt,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(hpOwnersCommittees)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: hpOwnersCommittees.id,
				committeeName: hpOwnersCommittees.committeeName,
				establishedDate: hpOwnersCommittees.establishedDate,
				term: hpOwnersCommittees.term,
				chairman: hpOwnersCommittees.chairman,
				contactPhone: hpOwnersCommittees.contactPhone,
				memberList: hpOwnersCommittees.memberList,
				position: hpOwnersCommittees.position,
				tenure: hpOwnersCommittees.tenure,
				remark: hpOwnersCommittees.remark,
				fullName: hpOwnersCommittees.fullName,
				gender: hpOwnersCommittees.gender,
				idNumber: hpOwnersCommittees.idNumber,
				address: hpOwnersCommittees.address,
				post: hpOwnersCommittees.post,
				status: hpOwnersCommittees.status,
				createdAt: hpOwnersCommittees.createdAt,
				updatedAt: hpOwnersCommittees.updatedAt,
			})
			.from(hpOwnersCommittees)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: OwnersCommitteeListItem[] = data.map((item) => ({
			id: item.id,
			fullName: item.fullName || "",
			gender: item.gender || "",
			phone: item.contactPhone || "",
			idNumber: item.idNumber || "",
			address: item.address || "",
			position: item.position || "",
			post: item.post || "",
			tenure: item.tenure || "",
			status: item.status || "",
			createTime: formatDateTime(item.createdAt),
			updateTime: formatDateTime(item.updatedAt),
			remark: item.remark || "",
			term: item.term || "",
			termStart: item.establishedDate?.toString() || "",
			termEnd: "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<OwnersCommitteeListItem>> = {
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
		console.error("[Owners Committee List] Error:", error);
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
