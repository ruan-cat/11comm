/**
 * @file Contracte Charge 列表接口
 * @description Contracte Charge list API
 * POST /api/property-manage/expense-manage/contracte-charge/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { exContractCharges, ctContracts } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	contractNumber: z.string().optional(),
	expenseItem: z.string().optional(),
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
			contractNumber: body.contractNumber === "" ? undefined : body.contractNumber,
			expenseItem: body.expenseItem === "" ? undefined : body.expenseItem,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.contractNumber) {
			conditions.push(like(exContractCharges.contractNumber, `%${query.contractNumber}%`));
		}

		if (query.expenseItem) {
			conditions.push(like(exContractCharges.expenseItem, `%${query.expenseItem}%`));
		}

		if (query.status) {
			conditions.push(eq(exContractCharges.status, query.status as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: exContractCharges.createdAt,
			updatedAt: exContractCharges.updatedAt,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(exContractCharges)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: exContractCharges.id,
				contractId: exContractCharges.contractId,
				contractNumber: exContractCharges.contractNumber,
				expenseItem: exContractCharges.expenseItem,
				receivableAmount: exContractCharges.receivableAmount,
				receivedAmount: exContractCharges.receivedAmount,
				chargeCycle: exContractCharges.chargeCycle,
				status: exContractCharges.status,
				remark: exContractCharges.remark,
				createdAt: exContractCharges.createdAt,
				updatedAt: exContractCharges.updatedAt,
			})
			.from(exContractCharges)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			contractId: item.contractId,
			contractNumber: item.contractNumber || "",
			expenseItem: item.expenseItem || "",
			receivableAmount: item.receivableAmount || "",
			receivedAmount: item.receivedAmount || "",
			chargeCycle: item.chargeCycle || "",
			status: item.status || "unpaid",
			remark: item.remark || "",
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
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
		console.error("[Contracte Charge List] Error:", error);
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
