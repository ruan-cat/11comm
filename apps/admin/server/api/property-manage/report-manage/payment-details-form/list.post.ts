/**
 * @file Payment Details Form 列表接口
 * @description Payment Details Form list API
 * POST /api/property-manage/report-manage/payment-details-form/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { rptPaymentDetails } from "@01s-11comm/type";
import type { JsonVO, PageDTO, PaymentDetailsFormListItem, PaymentDetailsFormQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	name: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PaymentDetailsFormListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<PaymentDetailsFormQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			name: body.name,
			status: body.status,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 查询总数
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptPaymentDetails);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await db
			.select({
				id: rptPaymentDetails.id,
				ownerName: rptPaymentDetails.ownerName,
				houseNumber: rptPaymentDetails.houseNumber,
				expenseItem: rptPaymentDetails.expenseItem,
				paymentAmount: rptPaymentDetails.paymentAmount,
				paymentTime: rptPaymentDetails.paymentTime,
				paymentMethod: rptPaymentDetails.paymentMethod,
				transactionNo: rptPaymentDetails.transactionNo,
				collector: rptPaymentDetails.collector,
				remark: rptPaymentDetails.remark,
				createdAt: rptPaymentDetails.createdAt,
				updatedAt: rptPaymentDetails.updatedAt,
			})
			.from(rptPaymentDetails)
			.orderBy(desc(rptPaymentDetails.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: PaymentDetailsFormListItem[] = data.map((item) => ({
			id: item.id || "",
			name: item.expenseItem || "",
			status: item.paymentAmount ? "已支付" : "未支付",
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
			remark: item.remark || "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<PaymentDetailsFormListItem>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list,
				total,
				pageSize: query.pageSize,
				pageIndex: query.pageIndex,
				totalPages,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[Payment Details Form List] Error:", error);
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
