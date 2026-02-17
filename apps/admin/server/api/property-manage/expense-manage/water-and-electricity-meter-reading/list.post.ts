/**
 * @file Water And Electricity Meter Reading 列表接口
 * @description Water And Electricity Meter Reading list API
 * POST /api/property-manage/expense-manage/water-and-electricity-meter-reading/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { exMeterReadings, exMeterReadingTypes } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	meterType: z.string().optional(),
	meterId: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
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
			meterType: body.meterType === "" ? undefined : body.meterType,
			meterId: body.meterId === "" ? undefined : body.meterId,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.meterId) {
			conditions.push(like(exMeterReadings.meterNo, `%${query.meterId}%`));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: exMeterReadings.createTime,
			updateTime: exMeterReadings.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(exMeterReadings)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 - 关联查询 */
		const data = await db
			.select({
				id: exMeterReadings.id,
				houseId: exMeterReadings.houseId,
				meterTypeId: exMeterReadings.meterTypeId,
				meterNo: exMeterReadings.meterNo,
				currentReading: exMeterReadings.currentReading,
				previousReading: exMeterReadings.previousReading,
				usage: exMeterReadings.usage,
				readingDate: exMeterReadings.readingDate,
				reader: exMeterReadings.reader,
				remark: exMeterReadings.remark,
				createTime: exMeterReadings.createTime,
				updateTime: exMeterReadings.updateTime,
			})
			.from(exMeterReadings)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			meterId: item.meterNo,
			meterType: query.meterType || "",
			objectName: item.houseId || "",
			lastReading: item.previousReading || "",
			currentReading: item.currentReading || "",
			lastReadingTime: item.readingDate ? new Date(item.readingDate).toISOString() : "",
			currentReadingTime: item.readingDate ? new Date(item.readingDate).toISOString() : "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
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
		console.error("[Water And Electricity Meter Reading List] Error:", error);
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
