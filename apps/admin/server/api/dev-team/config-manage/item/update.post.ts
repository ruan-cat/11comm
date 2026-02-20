/**
 * 更新配置项 API
 * @description 更新配置项记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { dtConfigItems, updateDtConfigItemSchema } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		const body = await readValidatedBody(event, updateDtConfigItemSchema.parse);
		const { id, ...updateData } = body;

		/** 执行更新操作 - 只更新提供的字段 */
		const [updatedConfigItem] = await db
			.update(dtConfigItems)
			.set(updateData)
			.where(eq(dtConfigItems.id, id))
			.returning();

		if (!updatedConfigItem) {
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "配置项不存在",
				data: null,
			};
			return notFoundResponse;
		}

		const response: JsonVO<typeof updatedConfigItem> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: updatedConfigItem,
		};
		return response;
	} catch (error: any) {
		console.error("[Config Item Update] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "更新失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
