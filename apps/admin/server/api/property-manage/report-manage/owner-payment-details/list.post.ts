/**
 * @file Owner Payment Details 列表接口
 * @description Owner Payment Details list API
 * POST /api/property-manage/report-manage/owner-payment-details/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { rptOwnerPaymentDetails } from "@01s-11comm/type";
import type { JsonVO, PageDTO, OwnerPaymentDetailsListItem, OwnerPaymentDetailsQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, and } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	houseNumberContractName: z.string().optional(),
	ownerName: z.string().optional(),
	ownerPhone: z.string().optional(),
	feeCategory: z.string().optional(),
	feeItem: z.string().optional(),
	community: z.string().optional(),
	year: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OwnerPaymentDetailsListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<OwnerPaymentDetailsQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			houseNumberContractName: body.houseNumberContractName,
			ownerName: body.ownerName,
			ownerPhone: body.ownerPhone,
			feeCategory: body.feeCategory,
			feeItem: body.feeItem,
			community: body.community,
			year: body.year,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 构建查询条件
		const conditions = [];

		if (query.ownerName) {
			conditions.push(like(rptOwnerPaymentDetails.ownerName, `%${query.ownerName}%`));
		}

		// 查询总数
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptOwnerPaymentDetails);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await db
			.select({
				id: rptOwnerPaymentDetails.id,
				ownerId: rptOwnerPaymentDetails.ownerId,
				ownerName: rptOwnerPaymentDetails.ownerName,
				totalReceivable: rptOwnerPaymentDetails.totalReceivable,
				totalPaid: rptOwnerPaymentDetails.totalPaid,
				totalOutstanding: rptOwnerPaymentDetails.totalOutstanding,
				remark: rptOwnerPaymentDetails.remark,
				createdAt: rptOwnerPaymentDetails.createdAt,
				updatedAt: rptOwnerPaymentDetails.updatedAt,
			})
			.from(rptOwnerPaymentDetails)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(rptOwnerPaymentDetails.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: OwnerPaymentDetailsListItem[] = data.map((item) => ({
			id: item.id || "",
			community: "",
			houseNumberContractName: "",
			ownerName: item.ownerName || "",
			ownerPhone: "",
			feeCategory: "",
			feeItem: "",
			year: "",
			january: "",
			february: "",
			march: "",
			april: "",
			may: "",
			june: "",
			july: "",
			august: "",
			september: "",
			october: "",
			november: "",
			december: "",
			total: item.totalReceivable || "0",
			receivable: item.totalReceivable || "0",
			prepaid: item.totalPaid || "0",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<OwnerPaymentDetailsListItem>> = {
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
		console.error("[Owner Payment Details List] Error:", error);
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
