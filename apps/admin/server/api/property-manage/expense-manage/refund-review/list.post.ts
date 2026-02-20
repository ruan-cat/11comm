/**
 * @file Refund Review 列表接口
 * @description Refund Review list API
 * POST /api/property-manage/expense-manage/refund-review/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { exRefundReviews } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	applicant: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
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
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";
		const sortFields: Record<string, any> = {
			createTime: exRefundReviews.createTime,
			updateTime: exRefundReviews.updateTime,
		};
		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);
		const countResult = await useDb(event)
			.select({ total: sql<number>`count(*)` })
			.from(exRefundReviews)
			.where(conditions.length > 0 ? and(...conditions) : undefined);
		const total = Number(countResult[0]?.total || 0);
		const data = await useDb(event)
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
				createTime: exRefundReviews.createTime,
				updateTime: exRefundReviews.updateTime,
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
			applyTime: formatDateTime(item.applyTime),
			applicant: item.applicant || "",
			status: item.status || "pending",
			reviewer: item.reviewer || "",
			reviewTime: formatDateTime(item.reviewTime),
			reviewOpinion: item.reviewOpinion || "",
			remark: item.remark || "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
		}));
		const totalPages = Math.ceil(total / query.pageSize);
		const response: JsonVO<PageDTO<(typeof list)[number]>> = {
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
			stack: error.stack,
		};
		return errorResponse;
	}
});
