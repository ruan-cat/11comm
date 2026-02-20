/**
 * 配置中心列表查询 API
 * @description 获取配置中心列表数据
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { dtConfigs } from "@01s-11comm/type";
import type { ConfigCenterListItem, JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, asc, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	configName: z.string().optional(),
	configType: z.string().optional(),
	configKey: z.string().optional(),
	status: z.enum(["enabled", "disabled"]).optional(),
	sortBy: z.enum(["createTime", "updateTime", "configName", "configKey", "sortOrder"]).optional(),
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
			status: body.status === "" ? undefined : body.status,
			configType: body.configType === "" ? undefined : body.configType,
			configName: body.configName === "" ? undefined : body.configName,
			configKey: body.configKey === "" ? undefined : body.configKey,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.configName) {
			conditions.push(like(dtConfigs.configName, `%${query.configName}%`));
		}

		if (query.configKey) {
			conditions.push(like(dtConfigs.configKey, `%${query.configKey}%`));
		}

		if (query.configType) {
			conditions.push(eq(dtConfigs.configType, query.configType));
		}

		if (query.status) {
			conditions.push(eq(dtConfigs.status, query.status));
		}

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建排序条件 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields = {
			createTime: dtConfigs.createTime,
			updateTime: dtConfigs.updateTime,
			configName: dtConfigs.configName,
			configKey: dtConfigs.configKey,
			sortOrder: dtConfigs.sortOrder,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(dtConfigs)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: dtConfigs.id,
				configName: dtConfigs.configName,
				configType: dtConfigs.configType,
				configKey: dtConfigs.configKey,
				configValue: dtConfigs.configValue,
				defaultValue: dtConfigs.defaultValue,
				configDescription: dtConfigs.configDescription,
				status: dtConfigs.status,
				sortOrder: dtConfigs.sortOrder,
				remark: dtConfigs.remark,
				createTime: dtConfigs.createTime,
				updateTime: dtConfigs.updateTime,
				createdBy: dtConfigs.createdBy,
				updatedBy: dtConfigs.updatedBy,
			})
			.from(dtConfigs)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		/**
		 * 使用 JsonVO<PageDTO<...>> 类型注解约束成功响应
		 * @description
		 * (typeof data)[number] 自动推断 Drizzle 查询结果的行类型
		 * 如果 data 字段结构不符合 PageDTO 的 list/total/pageIndex/pageSize/totalPages 约束，TypeScript 会报错
		 * 如果外层结构不符合 JsonVO 的 code/message/data 约束，TypeScript 也会报错
		 */
		const response: JsonVO<PageDTO<ConfigCenterListItem>> = {
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
		console.error("[Config Center List] Error:", error);

		/**
		 * 使用 JsonVO<null> 类型注解约束错误响应
		 * @description error 携带错误信息，stack 仅在开发环境暴露
		 */
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
