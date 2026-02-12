/**
 * 更新配置项 API
 * @description 更新配置项记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtConfigItems, updateDtConfigItemSchema } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	const body = await readValidatedBody(event, updateDtConfigItemSchema.parse);
	const { id, ...updateData } = body;

	// 3. 执行更新操作 - 只更新提供的字段
	const [updatedConfigItem] = await db
		.update(dtConfigItems)
		.set(updateData)
		.where(eq(dtConfigItems.id, id))
		.returning();

	// 4. 检查是否找到记录
	if (!updatedConfigItem) {
		return {
			code: 404,
			msg: "配置项不存在",
			data: null,
		};
	}

	// 5. 返回标准响应格式
	return {
		code: 200,
		msg: "更新成功",
		data: updatedConfigItem,
	};
});
