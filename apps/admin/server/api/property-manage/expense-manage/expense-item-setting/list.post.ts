/**
 * @file Expense Item Setting 列表接口
 * @description Expense Item Setting list API
 * POST /api/property-manage/expense-manage/expense-item-setting/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { exExpenseItems } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	itemName: z.string().optional(),
	expenseType: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			itemName: body.itemName === "" ? undefined : body.itemName,
			expenseType: body.expenseType === "" ? undefined : body.expenseType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.itemName) {
			conditions.push(like(exExpenseItems.itemName, `%${query.itemName}%`));
		}

		if (query.expenseType) {
			conditions.push(eq(exExpenseItems.expenseType, query.expenseType));
		}

		if (query.status) {
			conditions.push(eq(exExpenseItems.status, query.status as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: exExpenseItems.createdAt,
			updatedAt: exExpenseItems.updatedAt,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(exExpenseItems)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: exExpenseItems.id,
				expenseType: exExpenseItems.expenseType,
				itemName: exExpenseItems.itemName,
				expenseCode: exExpenseItems.expenseCode,
				paymentType: exExpenseItems.paymentType,
				unitPrice: exExpenseItems.unitPrice,
				fixedFee: exExpenseItems.fixedFee,
				formula: exExpenseItems.formula,
				billingCycle: exExpenseItems.billingCycle,
				accountDeduction: exExpenseItems.accountDeduction,
				mobilePayment: exExpenseItems.mobilePayment,
				roundingMode: exExpenseItems.roundingMode,
				decimalPlaces: exExpenseItems.decimalPlaces,
				status: exExpenseItems.status,
				remark: exExpenseItems.remark,
				createdAt: exExpenseItems.createdAt,
				updatedAt: exExpenseItems.updatedAt,
			})
			.from(exExpenseItems)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			expenseType: item.expenseType || "",
			itemName: item.itemName || "",
			expenseCode: item.expenseCode || "",
			paymentType: item.paymentType || "",
			unitPrice: item.unitPrice || "",
			fixedFee: item.fixedFee || "",
			formula: item.formula || "",
			billingCycle: item.billingCycle || "",
			accountDeduction: item.accountDeduction || false,
			mobilePayment: item.mobilePayment || true,
			roundingMode: item.roundingMode || "round",
			decimalPlaces: item.decimalPlaces || 2,
			status: item.status || "enabled",
			remark: item.remark || "",
			createTime: formatDateTime(item.createdAt),
			updateTime: formatDateTime(item.updatedAt),
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<any>> = {
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
		console.error("[Expense Item Setting List] Error:", error);
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
