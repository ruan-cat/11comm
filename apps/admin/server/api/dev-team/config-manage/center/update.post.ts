/**
 * 更新配置中心 API
 * @description 更新配置中心记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { dtConfigs, updateDtConfigSchema } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		const body = await readValidatedBody(event, updateDtConfigSchema.parse);
		const { id, ...updateData } = body;

		/** 执行更新操作 - 只更新提供的字段 */
		const [updatedConfig] = await db.update(dtConfigs).set(updateData).where(eq(dtConfigs.id, id)).returning();

		if (!updatedConfig) {
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "配置中心不存在",
				data: null,
			};
			return notFoundResponse;
		}

		const response: JsonVO<typeof updatedConfig> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: updatedConfig,
		};
		return response;
	} catch (error: any) {
		console.error("[Config Center Update] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "更新失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
