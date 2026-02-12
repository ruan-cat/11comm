/**
 * 创建字典 API
 * @description 创建新的字典记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtDictionaries, insertDtDictionarySchema } from "@01s-11comm/type";
import type { NewDtDictionary } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	const body = (await readValidatedBody(event, insertDtDictionarySchema.parse)) as unknown as NewDtDictionary;

	const [newDictionary] = await db.insert(dtDictionaries).values(body).returning();

	// 3. 返回标准响应格式
	return {
		code: 200,
		msg: "创建成功",
		data: newDictionary,
	};
});
