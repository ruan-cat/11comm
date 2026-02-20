/**
 * @file Payment Review 列表接口
 * @description Payment Review list API
 * POST /api/property-manage/expense-manage/payment-review/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { exPaymentReviews } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	reviewer: z.string().optional(),
	reviewResult: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			reviewer: body.reviewer === "" ? undefined : body.reviewer,
			reviewResult: body.reviewResult === "" ? undefined : body.reviewResult,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.page - 1) * query.pageSize;
		const conditions = [];
		if (query.reviewer) conditions.push(like(exPaymentReviews.reviewer, `%${query.reviewer}%`));
		if (query.reviewResult) conditions.push(eq(exPaymentReviews.reviewResult, query.reviewResult as any));
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";
		const sortFields: Record<string, any> = {
			createTime: exPaymentReviews.createTime,
			updateTime: exPaymentReviews.updateTime,
		};
		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(exPaymentReviews)
			.where(conditions.length > 0 ? and(...conditions) : undefined);
		const total = Number(countResult[0]?.total || 0);
		const data = await db
			.select({
				id: exPaymentReviews.id,
				paymentId: exPaymentReviews.paymentId,
				reviewer: exPaymentReviews.reviewer,
				reviewOpinion: exPaymentReviews.reviewOpinion,
				reviewResult: exPaymentReviews.reviewResult,
				reviewTime: exPaymentReviews.reviewTime,
				remark: exPaymentReviews.remark,
				createTime: exPaymentReviews.createTime,
				updateTime: exPaymentReviews.updateTime,
			})
			.from(exPaymentReviews)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);
		const list = data.map((item) => ({
			id: item.id,
			paymentId: item.paymentId,
			reviewer: item.reviewer || "",
			reviewOpinion: item.reviewOpinion || "",
			reviewResult: item.reviewResult || "pending",
			reviewTime: formatDateTime(item.reviewTime),
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
		console.error("[Payment Review List] Error:", error);
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
