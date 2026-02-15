/**
 * @file Expense Summary Table 列表接口
 * @description Expense Summary Table list API
 * POST /api/property-manage/expense-manage/expense-summary-table/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { exExpenseSummaryTables } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import type { ExpenseSummaryTableListItem } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	/** 时间 Time */
	time: z.string().optional(),
	/** 费用项ID Expense Item ID */
	expenseItemId: z.string().optional(),
	/** 费用项名称 Expense Item Name */
	expenseItemName: z.string().optional(),
	/** 状态 Status */
	status: z.string().optional(),
	/** 当前页码 Current page (1-based) */
	page: z.coerce.number().min(1).default(1),
	/** 每页大小 Page size */
	pageSize: z.coerce.number().min(1).max(100).default(10),
});

export default defineHandler(async (event) => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const query = querySchema.parse({
			...body,
			page: body.page || body.pageIndex || 1,
		});

		// 2. 构建动态查询条件
		const conditions = [];

		// 模糊搜索：时间
		if (query.time) {
			conditions.push(like(exExpenseSummaryTables.time, `%${query.time}%`));
		}

		// 模糊搜索：费用项名称
		if (query.expenseItemName) {
			conditions.push(like(exExpenseSummaryTables.expenseItemName, `%${query.expenseItemName}%`));
		}

		// 精确匹配：费用项ID
		if (query.expenseItemId) {
			conditions.push(eq(exExpenseSummaryTables.expenseItemId, query.expenseItemId));
		}

		// 精确匹配：状态
		if (query.status) {
			conditions.push(eq(exExpenseSummaryTables.status, query.status as "enabled" | "disabled"));
		}

		// 3. 计算分页偏移
		const offset = (query.page - 1) * query.pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select()
				.from(exExpenseSummaryTables)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(exExpenseSummaryTables.createdAt))
				.limit(query.pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`cast(count(${exExpenseSummaryTables.id}) as int)` })
				.from(exExpenseSummaryTables)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		// 5. 返回标准分页结构
		const total = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(total / query.pageSize);

		// 映射到前端类型 - 转换时间字段格式
		const list: ExpenseSummaryTableListItem[] = data.map((item) => ({
			id: item.id,
			time: item.time,
			expenseItemId: item.expenseItemId || "",
			expenseItemName: item.expenseItemName,
			receivableAmount: item.receivableAmount,
			actualAmount: item.actualAmount,
			status: item.status || "enabled",
			remark: item.remark || "",
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
		}));

		/** 必须使用 JsonVO<PageDTO<...>> 类型注解约束响应 */
		const response: JsonVO<PageDTO<ExpenseSummaryTableListItem>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list,
				total,
				pageIndex: query.page,
				pageSize: query.pageSize,
				totalPages,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[ExpenseSummaryTable List] Error:", error);

		/** 必须使用 JsonVO<null> 类型注解约束错误响应 */
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
