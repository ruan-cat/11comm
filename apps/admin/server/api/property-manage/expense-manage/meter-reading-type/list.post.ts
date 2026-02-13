/**
 * @file Meter Reading Type 列表接口
 * @description Meter Reading Type list API
 * POST /api/property-manage/expense-manage/meter-reading-type/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { exMeterReadingTypes } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	typeName: z.string().optional(),
	typeCode: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			typeName: body.typeName === "" ? undefined : body.typeName,
			typeCode: body.typeCode === "" ? undefined : body.typeCode,
			status: body.status === "" ? undefined : body.status,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.page - 1) * query.pageSize;
		const conditions = [];
		if (query.typeName) conditions.push(like(exMeterReadingTypes.typeName, `%${query.typeName}%`));
		if (query.typeCode) conditions.push(like(exMeterReadingTypes.typeCode, `%${query.typeCode}%`));
		if (query.status) conditions.push(eq(exMeterReadingTypes.status, query.status as any));
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";
		const sortFields: Record<string, any> = {
			createdAt: exMeterReadingTypes.createdAt,
			updatedAt: exMeterReadingTypes.updatedAt,
		};
		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(exMeterReadingTypes)
			.where(conditions.length > 0 ? and(...conditions) : undefined);
		const total = Number(countResult[0]?.total || 0);
		const data = await db
			.select({
				id: exMeterReadingTypes.id,
				typeName: exMeterReadingTypes.typeName,
				typeCode: exMeterReadingTypes.typeCode,
				unitPrice: exMeterReadingTypes.unitPrice,
				billingMethod: exMeterReadingTypes.billingMethod,
				status: exMeterReadingTypes.status,
				remark: exMeterReadingTypes.remark,
				createdAt: exMeterReadingTypes.createdAt,
				updatedAt: exMeterReadingTypes.updatedAt,
			})
			.from(exMeterReadingTypes)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);
		const list = data.map((item) => ({
			id: item.id,
			typeName: item.typeName || "",
			typeCode: item.typeCode || "",
			unitPrice: item.unitPrice || "",
			billingMethod: item.billingMethod || "",
			status: item.status || "enabled",
			remark: item.remark || "",
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
		}));
		const totalPages = Math.ceil(total / query.pageSize);
		const response: JsonVO<PageDTO<any>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: { list, total, pageSize: query.pageSize, pageIndex: query.page, totalPages },
		};
		return response;
	} catch (error: any) {
		console.error("[Meter Reading Type List] Error:", error);
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
