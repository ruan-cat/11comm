/**
 * @file Expense Summary Table 列表接口
 * @description Expense Summary Table list API
 * POST /api/property-manage/report-manage/expense-summary-table/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { rptExpenseSummaries } from "@01s-11comm/type";
import type { JsonVO, PageDTO, ExpenseSummaryTableListItem, ExpenseSummaryTableQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, and, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	time: z.string().optional(),
	expenseItemId: z.string().optional(),
	expenseItemName: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ExpenseSummaryTableListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<ExpenseSummaryTableQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			time: body.time,
			expenseItemId: body.expenseItemId,
			expenseItemName: body.expenseItemName,
			status: body.status,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 构建查询条件
		const conditions = [];

		if (query.expenseItemName) {
			conditions.push(like(rptExpenseSummaries.expenseItem, `%${query.expenseItemName}%`));
		}

		if (query.time) {
			conditions.push(eq(rptExpenseSummaries.periodStart, query.time));
		}

		// 查询总数
		const countResult = await useDb(event)
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptExpenseSummaries);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await useDb(event)
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
				remark: rptExpenseSummaries.remark,
				createTime: rptExpenseSummaries.createTime,
				updateTime: rptExpenseSummaries.updateTime,
			})
			.from(rptExpenseSummaries)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(rptExpenseSummaries.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据 - 转换时间字段格式
		const list: ExpenseSummaryTableListItem[] = data.map((item) => ({
			id: item.id || "",
			time: item.periodStart || "",
			expenseItemId: "",
			expenseItemName: item.expenseItem || "",
			receivableAmount: item.receivableTotal || "0",
			actualAmount: item.receivedTotal || "0",
			status: item.receivableTotal ? "enabled" : "disabled",
			remark: item.remark || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<ExpenseSummaryTableListItem>> = {
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
		console.error("[Expense Summary Table List] Error:", error);
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
