/**
 * 配置类型详情 API
 * @description 获取配置类型详情数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { dtConfigTypes } from "@01s-11comm/type";
import type { DictionaryTypeDetailItem, JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		/** 获取并验证查询参数 */
		const rawQuery = getQuery(event);
		const query = querySchema.parse(rawQuery);

		/** 查询详情数据 */
		const [configType] = await db
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
			.where(eq(dtConfigTypes.id, query.id))
			.limit(1);

		if (!configType) {
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "配置类型不存在",
				data: null,
			};
			return notFoundResponse;
		}

		const response: JsonVO<DictionaryTypeDetailItem> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				...configType,
				createTime: configType.createTime ? formatDateTime(configType.createTime) : null,
				updateTime: configType.updateTime ? formatDateTime(configType.updateTime) : null,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[Config Type Detail] Error:", error);
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
