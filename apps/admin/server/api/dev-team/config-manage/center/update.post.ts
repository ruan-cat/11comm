/**
 * 更新配置中心 API
 * @description 更新配置中心记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtConfigs, updateDtConfigSchema } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	const body = await readValidatedBody(event, updateDtConfigSchema.parse);
	const { id, ...updateData } = body;

	// 3. 执行更新操作 - 只更新提供的字段
	const [updatedConfig] = await db.update(dtConfigs).set(updateData).where(eq(dtConfigs.id, id)).returning();

	// 4. 检查是否找到记录
	if (!updatedConfig) {
		return {
			code: 404,
			msg: "配置中心不存在",
			data: null,
		};
	}

	// 5. 返回标准响应格式
	return {
		code: 200,
		msg: "更新成功",
		data: updatedConfig,
	};
});
