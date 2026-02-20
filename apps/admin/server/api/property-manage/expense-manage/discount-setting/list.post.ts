/**
 * @file Discount Setting 列表接口
 * @description Discount Setting list API
 * POST /api/property-manage/expense-manage/discount-setting/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { exDiscountSettings } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	applicableItem: z.string().optional(),
	discountType: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			applicableItem: body.applicableItem === "" ? undefined : body.applicableItem,
			discountType: body.discountType === "" ? undefined : body.discountType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.applicableItem) {
			conditions.push(like(exDiscountSettings.applicableItem, `%${query.applicableItem}%`));
		}

		if (query.discountType) {
			conditions.push(eq(exDiscountSettings.discountType, query.discountType));
		}

		if (query.status) {
			conditions.push(eq(exDiscountSettings.status, query.status as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: exDiscountSettings.createTime,
			updateTime: exDiscountSettings.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await useDb(event)
			.select({ total: sql<number>`count(*)` })
			.from(exDiscountSettings)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await useDb(event)
			.select({
				id: exDiscountSettings.id,
				discountTypeId: exDiscountSettings.discountTypeId,
				applicableItem: exDiscountSettings.applicableItem,
				discountType: exDiscountSettings.discountType,
				validityStart: exDiscountSettings.validityStart,
				validityEnd: exDiscountSettings.validityEnd,
				validityPeriod: exDiscountSettings.validityPeriod,
				conditions: exDiscountSettings.conditions,
				status: exDiscountSettings.status,
				remark: exDiscountSettings.remark,
				createTime: exDiscountSettings.createTime,
				updateTime: exDiscountSettings.updateTime,
			})
			.from(exDiscountSettings)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			discountTypeId: item.discountTypeId,
			applicableItem: item.applicableItem || "",
			discountType: item.discountType || "",
			validityStart: item.validityStart || "",
			validityEnd: item.validityEnd || "",
			validityPeriod: item.validityPeriod || "",
			conditions: item.conditions || "",
			status: item.status || "enabled",
			remark: item.remark || "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<(typeof list)[number]>> = {
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
		console.error("[Discount Setting List] Error:", error);
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
