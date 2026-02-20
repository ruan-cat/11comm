/**
 * 配置项详情 API
 * @description 获取配置项详情数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigItems, dtConfigTypes } from "@01s-11comm/type";
import type { JsonVO, ConfigItemDetailItem } from "@01s-11comm/type";
import { eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	try {
		/** 获取并验证查询参数 */
		const rawQuery = getQuery(event);
		const query = querySchema.parse(rawQuery);

		/** 查询详情数据 - 关联配置类型表 */
		const [configItem] = await db
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
			.where(eq(dtConfigItems.id, query.id))
			.limit(1);

		if (!configItem) {
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "配置项不存在",
				data: null,
			};
			return notFoundResponse;
		}

		const response: JsonVO<ConfigItemDetailItem> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				...configItem,
				createTime: configItem.createTime ? formatDateTime(configItem.createTime) : "",
				updateTime: configItem.updateTime ? formatDateTime(configItem.updateTime) : "",
			},
		};
		return response;
	} catch (error: any) {
		console.error("[Config Item Detail] Error:", error);
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
