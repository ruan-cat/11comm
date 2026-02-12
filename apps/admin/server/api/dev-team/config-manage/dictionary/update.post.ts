/**
 * 更新字典 API
 * @description 更新字典记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtDictionaries, updateDtDictionarySchema } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	const body = await readValidatedBody(event, updateDtDictionarySchema.parse);
	const { id, ...updateData } = body;

	// 3. 执行更新操作 - 只更新提供的字段
	const [updatedDictionary] = await db
		.update(dtDictionaries)
		.set(updateData)
		.where(eq(dtDictionaries.id, id))
		.returning();

	// 4. 检查是否找到记录
	if (!updatedDictionary) {
		return {
			code: 404,
			msg: "字典不存在",
			data: null,
		};
	}

	// 5. 返回标准响应格式
	return {
		code: 200,
		msg: "更新成功",
		data: updatedDictionary,
	};
});
