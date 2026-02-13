/**
 * @file Statement Expenses 列表接口
 * @description Statement Expenses list API
 * POST /api/property-manage/report-manage/statement-expenses/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { rptStatementExpenses } from "@01s-11comm/type";
import type { JsonVO, PageDTO, StatementExpensesListItem, StatementExpensesQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, and } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	community: z.string().optional(),
	houseContractName: z.string().optional(),
	ownerName: z.string().optional(),
	expenseType: z.string().optional(),
	expenseItem: z.string().optional(),
	expenseStatus: z.string().optional(),
	paymentMethod: z.string().optional(),
	billingPeriod: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<StatementExpensesListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<StatementExpensesQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			community: body.community,
			houseContractName: body.houseContractName,
			ownerName: body.ownerName,
			expenseType: body.expenseType,
			expenseItem: body.expenseItem,
			expenseStatus: body.expenseStatus,
			paymentMethod: body.paymentMethod,
			billingPeriod: body.billingPeriod,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 构建查询条件
		const conditions = [];

		if (query.expenseType) {
			conditions.push(like(rptStatementExpenses.reportType, `%${query.expenseType}%`));
		}

		if (query.billingPeriod) {
			conditions.push(like(rptStatementExpenses.reportPeriod, `%${query.billingPeriod}%`));
		}

		// 查询总数
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptStatementExpenses);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await db
			.select({
				id: rptStatementExpenses.id,
				reportType: rptStatementExpenses.reportType,
				reportPeriod: rptStatementExpenses.reportPeriod,
				dataSnapshot: rptStatementExpenses.dataSnapshot,
				remark: rptStatementExpenses.remark,
				createdAt: rptStatementExpenses.createdAt,
				updatedAt: rptStatementExpenses.updatedAt,
			})
			.from(rptStatementExpenses)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(rptStatementExpenses.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: StatementExpensesListItem[] = data.map((item) => ({
			id: item.id || "",
			community: "",
			houseContractName: "",
			ownerName: "",
			expenseType: item.reportType || "",
			expenseItem: "",
			expenseStatus: "",
			paymentMethod: "",
			receivableAmount: 0,
			receivedAmount: 0,
			unpaidAmount: 0,
			billingPeriod: item.reportPeriod || "",
			startDate: "",
			endDate: "",
			billingArea: 0,
			parkingSpace: "",
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<StatementExpensesListItem>> = {
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
		console.error("[Statement Expenses List] Error:", error);
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
