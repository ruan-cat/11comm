/**
 * 字典列表查询 API
 * @description 获取字典列表数据
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtDictionaries } from "@01s-11comm/type";
import type { DictionaryListItem, JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, asc, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	dictionaryName: z.string().optional(),
	dictionaryCode: z.string().optional(),
	dictionaryType: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime", "dictionaryName", "dictionaryCode"]).optional(),
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
			dictionaryName: body.dictionaryName === "" ? undefined : body.dictionaryName,
			dictionaryCode: body.dictionaryCode === "" ? undefined : body.dictionaryCode,
			dictionaryType: body.dictionaryType === "" ? undefined : body.dictionaryType,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.dictionaryName) {
			conditions.push(like(dtDictionaries.dictionaryName, `%${query.dictionaryName}%`));
		}

		if (query.dictionaryCode) {
			conditions.push(like(dtDictionaries.dictionaryCode, `%${query.dictionaryCode}%`));
		}

		if (query.dictionaryType) {
			conditions.push(eq(dtDictionaries.dictionaryType, query.dictionaryType));
		}

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建排序条件 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields = {
			createTime: dtDictionaries.createTime,
			updateTime: dtDictionaries.updateTime,
			dictionaryName: dtDictionaries.dictionaryName,
			dictionaryCode: dtDictionaries.dictionaryCode,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(dtDictionaries)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: dtDictionaries.id,
				dictionaryName: dtDictionaries.dictionaryName,
				dictionaryCode: dtDictionaries.dictionaryCode,
				dictionaryType: dtDictionaries.dictionaryType,
				dictionaryDescription: dtDictionaries.dictionaryDescription,
				remark: dtDictionaries.remark,
				createTime: dtDictionaries.createTime,
				updateTime: dtDictionaries.updateTime,
			})
			.from(dtDictionaries)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<DictionaryListItem>> = {
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
		console.error("[Dictionary List] Error:", error);
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
