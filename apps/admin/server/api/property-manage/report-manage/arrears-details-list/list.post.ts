/**
 * @file Arrears Details List 列表接口
 * @description Arrears Details List list API
 * POST /api/property-manage/report-manage/arrears-details-list/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { rptExpenseSummaries } from "@01s-11comm/type";
import type { JsonVO, PageDTO, ArrearsDetailsListItem, ArrearsDetailsListQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, eq, and } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	feeNumber: z.string().optional(),
	roomNumber: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	community: z.string().optional(),
	owner: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ArrearsDetailsListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<ArrearsDetailsListQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			feeNumber: body.feeNumber,
			roomNumber: body.roomNumber,
			startTime: body.startTime,
			endTime: body.endTime,
			community: body.community,
			owner: body.owner,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 构建查询条件
		const conditions = [];

		if (query.roomNumber) {
			conditions.push(like(rptExpenseSummaries.building, `%${query.roomNumber}%`));
		}

		if (query.startTime) {
			conditions.push(eq(rptExpenseSummaries.periodStart, query.startTime));
		}

		if (query.endTime) {
			conditions.push(eq(rptExpenseSummaries.periodEnd, query.endTime));
		}

		// 查询总数
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptExpenseSummaries);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await db
			.select({
				id: rptExpenseSummaries.id,
				communityId: rptExpenseSummaries.communityId,
				periodStart: rptExpenseSummaries.periodStart,
				periodEnd: rptExpenseSummaries.periodEnd,
				expenseType: rptExpenseSummaries.expenseType,
				receivableTotal: rptExpenseSummaries.receivableTotal,
				receivedTotal: rptExpenseSummaries.receivedTotal,
				outstandingTotal: rptExpenseSummaries.outstandingTotal,
				building: rptExpenseSummaries.building,
				expenseItem: rptExpenseSummaries.expenseItem,
				createTime: rptExpenseSummaries.createTime,
				updateTime: rptExpenseSummaries.updateTime,
			})
			.from(rptExpenseSummaries)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(rptExpenseSummaries.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: ArrearsDetailsListItem[] = data.map((item) => ({
			feeNumber: item.id || "",
			roomNumber: item.building || "",
			owner: "",
			ownerPhone: "",
			area: "",
			feeItem: item.expenseItem || "",
			startTime: item.periodStart || "",
			endTime: item.periodEnd || "",
			arrearsDuration: "",
			arrearsAmount: item.outstandingTotal || "0",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<ArrearsDetailsListItem>> = {
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
		console.error("[Arrears Details List] Error:", error);
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
