/**
 * @file House Decoration 列表接口
 * @description House Decoration list API
 * POST /api/property-manage/community-manage/house-decoration/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { cmHouseDecorations } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	houseNumber: z.string().optional(),
	ownerInfo: z.string().optional(),
	decorationCompany: z.string().optional(),
	auditStatus: z.string().optional(),
	plannedStartTime: z.string().optional(),
	plannedEndTime: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数：映射 pageIndex，空字符串清洗为 undefined */
		const rawQuery = {
			...body,
			pageIndex: body.pageIndex || 1,
			houseNumber: body.houseNumber === "" ? undefined : body.houseNumber,
			ownerInfo: body.ownerInfo === "" ? undefined : body.ownerInfo,
			decorationCompany: body.decorationCompany === "" ? undefined : body.decorationCompany,
			auditStatus: body.auditStatus === "" ? undefined : body.auditStatus,
			plannedStartTime: body.plannedStartTime === "" ? undefined : body.plannedStartTime,
			plannedEndTime: body.plannedEndTime === "" ? undefined : body.plannedEndTime,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.houseNumber) {
			conditions.push(like(cmHouseDecorations.houseNumber, `%${query.houseNumber}%`));
		}

		if (query.ownerInfo) {
			conditions.push(like(cmHouseDecorations.ownerInfo, `%${query.ownerInfo}%`));
		}

		if (query.decorationCompany) {
			conditions.push(like(cmHouseDecorations.decorationCompany, `%${query.decorationCompany}%`));
		}

		if (query.auditStatus) {
			conditions.push(eq(cmHouseDecorations.auditStatus, query.auditStatus as any));
		}

		/** 计算分页参数 */
		const offset = (query.pageIndex - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(cmHouseDecorations)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: cmHouseDecorations.id,
				houseNumber: cmHouseDecorations.houseNumber,
				ownerInfo: cmHouseDecorations.ownerInfo,
				decorationCompany: cmHouseDecorations.decorationCompany,
				plannedStartTime: cmHouseDecorations.plannedStartTime,
				plannedEndTime: cmHouseDecorations.plannedEndTime,
				auditStatus: cmHouseDecorations.auditStatus,
				auditor: cmHouseDecorations.auditor,
				auditTime: cmHouseDecorations.auditTime,
				remark: cmHouseDecorations.remark,
				createdAt: cmHouseDecorations.createdAt,
				updatedAt: cmHouseDecorations.updatedAt,
			})
			.from(cmHouseDecorations)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(cmHouseDecorations.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<(typeof data)[number]>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list: data,
				total,
				pageSize: query.pageSize,
				pageIndex: query.pageIndex,
				totalPages,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[House Decoration List] Error:", error);
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
