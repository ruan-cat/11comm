/**
 * 配置类型列表查询 API
 * @description 获取配置类型列表数据
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigTypes } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, asc, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	typeName: z.string().optional(),
	typeCode: z.string().optional(),
	typeDescription: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime", "typeName", "typeCode", "sortOrder"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数：映射 pageIndex → page，空字符串清洗为 undefined */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			typeName: body.typeName === "" ? undefined : body.typeName,
			typeCode: body.typeCode === "" ? undefined : body.typeCode,
			typeDescription: body.typeDescription === "" ? undefined : body.typeDescription,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.typeName) {
			conditions.push(like(dtConfigTypes.typeName, `%${query.typeName}%`));
		}

		if (query.typeCode) {
			conditions.push(like(dtConfigTypes.typeCode, `%${query.typeCode}%`));
		}

		if (query.typeDescription) {
			conditions.push(like(dtConfigTypes.typeDescription, `%${query.typeDescription}%`));
		}

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建排序条件 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields = {
			createTime: dtConfigTypes.createTime,
			updateTime: dtConfigTypes.updateTime,
			typeName: dtConfigTypes.typeName,
			typeCode: dtConfigTypes.typeCode,
			sortOrder: dtConfigTypes.sortOrder,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(dtConfigTypes)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: dtConfigTypes.id,
				typeName: dtConfigTypes.typeName,
				typeCode: dtConfigTypes.typeCode,
				typeDescription: dtConfigTypes.typeDescription,
				sortOrder: dtConfigTypes.sortOrder,
				createTime: dtConfigTypes.createTime,
				updateTime: dtConfigTypes.updateTime,
			})
			.from(dtConfigTypes)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<(typeof data)[number]>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list: data.map((item) => ({
					...item,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
				total,
				pageSize: query.pageSize,
				pageIndex: query.page,
				totalPages,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[Config Type List] Error:", error);
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
