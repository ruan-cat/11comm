/**
 * @file Discount Type 列表接口
 * @description Discount Type list API
 * POST /api/property-manage/expense-manage/discount-type/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { exDiscountTypes } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	discountName: z.string().optional(),
	discountType: z.string().optional(),
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
			discountName: body.discountName === "" ? undefined : body.discountName,
			discountType: body.discountType === "" ? undefined : body.discountType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.discountName) {
			conditions.push(like(exDiscountTypes.discountName, `%${query.discountName}%`));
		}

		if (query.discountType) {
			conditions.push(eq(exDiscountTypes.discountType, query.discountType as any));
		}

		if (query.status) {
			conditions.push(eq(exDiscountTypes.status, query.status as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: exDiscountTypes.createdAt,
			updatedAt: exDiscountTypes.updatedAt,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(exDiscountTypes)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: exDiscountTypes.id,
				discountName: exDiscountTypes.discountName,
				discountType: exDiscountTypes.discountType,
				discountValue: exDiscountTypes.discountValue,
				status: exDiscountTypes.status,
				remark: exDiscountTypes.remark,
				createdAt: exDiscountTypes.createdAt,
				updatedAt: exDiscountTypes.updatedAt,
			})
			.from(exDiscountTypes)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			discountName: item.discountName || "",
			discountType: item.discountType || "",
			discountValue: item.discountValue || "",
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
		console.error("[Discount Type List] Error:", error);
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
