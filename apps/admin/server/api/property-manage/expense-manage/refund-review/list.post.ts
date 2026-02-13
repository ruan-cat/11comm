/**
 * @file Refund Review 列表接口
 * @description Refund Review list API
 * POST /api/property-manage/expense-manage/refund-review/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { exRefundReviews } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";

const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	applicant: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			applicant: body.applicant === "" ? undefined : body.applicant,
			status: body.status === "" ? undefined : body.status,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.page - 1) * query.pageSize;
		const conditions = [];
		if (query.applicant) conditions.push(like(exRefundReviews.applicant, `%${query.applicant}%`));
		if (query.status) conditions.push(eq(exRefundReviews.status, query.status as any));
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";
		const sortFields: Record<string, any> = {
			createdAt: exRefundReviews.createdAt,
			updatedAt: exRefundReviews.updatedAt,
		};
		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(exRefundReviews)
			.where(conditions.length > 0 ? and(...conditions) : undefined);
		const total = Number(countResult[0]?.total || 0);
		const data = await db
			.select({
				id: exRefundReviews.id,
				chargeId: exRefundReviews.chargeId,
				chargeType: exRefundReviews.chargeType,
				refundReason: exRefundReviews.refundReason,
				refundAmount: exRefundReviews.refundAmount,
				applyTime: exRefundReviews.applyTime,
				applicant: exRefundReviews.applicant,
				status: exRefundReviews.status,
				reviewer: exRefundReviews.reviewer,
				reviewTime: exRefundReviews.reviewTime,
				reviewOpinion: exRefundReviews.reviewOpinion,
				remark: exRefundReviews.remark,
				createdAt: exRefundReviews.createdAt,
				updatedAt: exRefundReviews.updatedAt,
			})
			.from(exRefundReviews)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);
		const list = data.map((item) => ({
			id: item.id,
			chargeId: item.chargeId,
			chargeType: item.chargeType || "",
			refundReason: item.refundReason || "",
			refundAmount: item.refundAmount || "",
			applyTime: item.applyTime ? new Date(item.applyTime).toISOString() : "",
			applicant: item.applicant || "",
			status: item.status || "pending",
			reviewer: item.reviewer || "",
			reviewTime: item.reviewTime ? new Date(item.reviewTime).toISOString() : "",
			reviewOpinion: item.reviewOpinion || "",
			remark: item.remark || "",
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
		}));
		const totalPages = Math.ceil(total / query.pageSize);
		const response: JsonVO<PageDTO<any>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: { list, total, pageSize: query.pageSize, pageIndex: query.page, totalPages },
		};
		return response;
	} catch (error: any) {
		console.error("[Refund Review List] Error:", error);
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
