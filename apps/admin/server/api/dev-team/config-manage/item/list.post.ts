/**
 * 配置项列表查询 API
 * @description 获取配置项列表数据
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { dtConfigItems, dtConfigTypes } from "@01s-11comm/type";
import type { ConfigItemListItem, JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, asc, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	itemName: z.string().optional(),
	itemKey: z.string().optional(),
	typeId: z.string().uuid().optional(),
	dataType: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime", "itemName", "itemKey", "typeId"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数：映射 pageIndex → page，空字符串清洗为 undefined */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			itemName: body.itemName === "" ? undefined : body.itemName,
			itemKey: body.itemKey === "" ? undefined : body.itemKey,
			typeId: body.typeId === "" ? undefined : body.typeId,
			dataType: body.dataType === "" ? undefined : body.dataType,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.itemName) {
			conditions.push(like(dtConfigItems.itemName, `%${query.itemName}%`));
		}

		if (query.itemKey) {
			conditions.push(like(dtConfigItems.itemKey, `%${query.itemKey}%`));
		}

		if (query.typeId) {
			conditions.push(eq(dtConfigItems.typeId, query.typeId));
		}

		if (query.dataType) {
			conditions.push(eq(dtConfigItems.dataType, query.dataType));
		}

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建排序条件 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields = {
			createTime: dtConfigItems.createTime,
			updateTime: dtConfigItems.updateTime,
			itemName: dtConfigItems.itemName,
			itemKey: dtConfigItems.itemKey,
			typeId: dtConfigItems.typeId,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(dtConfigItems)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 - 关联配置类型表获取更多信息 */
		const data = await db
			.select({
				id: dtConfigItems.id,
				itemName: dtConfigItems.itemName,
				itemKey: dtConfigItems.itemKey,
				typeId: dtConfigItems.typeId,
				dataType: dtConfigItems.dataType,
				validationRule: dtConfigItems.validationRule,
				createTime: dtConfigItems.createTime,
				updateTime: dtConfigItems.updateTime,
				typeName: dtConfigTypes.typeName,
				typeCode: dtConfigTypes.typeCode,
			})
			.from(dtConfigItems)
			.leftJoin(dtConfigTypes, eq(dtConfigItems.typeId, dtConfigTypes.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<ConfigItemListItem>> = {
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
		console.error("[Config Item List] Error:", error);
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
