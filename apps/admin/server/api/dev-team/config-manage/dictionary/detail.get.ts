/**
 * 字典详情 API
 * @description 获取字典详情数据
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtDictionaries } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

// 查询参数验证 schema
const querySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	// 1. 获取并验证查询参数
	const rawQuery = getQuery(event);
	const query = querySchema.parse(rawQuery);

	// 2. 查询详情数据
	const [dictionary] = await db
		.select({
			id: dtDictionaries.id,
			dictionaryName: dtDictionaries.dictionaryName,
			dictionaryCode: dtDictionaries.dictionaryCode,
			dictionaryType: dtDictionaries.dictionaryType,
			dictionaryDescription: dtDictionaries.dictionaryDescription,
			remark: dtDictionaries.remark,
			createdAt: dtDictionaries.createdAt,
			updatedAt: dtDictionaries.updatedAt,
		})
		.from(dtDictionaries)
		.where(eq(dtDictionaries.id, query.id))
		.limit(1);

	// 3. 检查是否找到记录
	if (!dictionary) {
		return {
			code: 404,
			msg: "字典不存在",
			data: null,
		};
	}

	// 4. 返回标准响应格式
	return {
		code: 200,
		msg: "查询成功",
		data: dictionary,
	};
});
