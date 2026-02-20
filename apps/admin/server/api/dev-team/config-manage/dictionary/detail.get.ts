/**
 * 字典详情 API
 * @description 获取字典详情数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { dtDictionaries } from "@01s-11comm/type";
import type { JsonVO, DictionaryDetailItem } from "@01s-11comm/type";
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
		const [dictionary] = await db
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
			.where(eq(dtDictionaries.id, query.id))
			.limit(1);

		if (!dictionary) {
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "字典不存在",
				data: null,
			};
			return notFoundResponse;
		}

		const response: JsonVO<DictionaryDetailItem> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				...dictionary,
				createTime: dictionary.createTime ? formatDateTime(dictionary.createTime) : null,
				updateTime: dictionary.updateTime ? formatDateTime(dictionary.updateTime) : null,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[Dictionary Detail] Error:", error);
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
