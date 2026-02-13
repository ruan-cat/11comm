/**
 * 更新配置类型 API
 * @description 更新配置类型记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtConfigTypes, updateDtConfigTypeSchema } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	try {
		const body = await readValidatedBody(event, updateDtConfigTypeSchema.parse);
		const { id, ...updateData } = body;

		/** 执行更新操作 - 只更新提供的字段 */
		const [updatedConfigType] = await db
			.update(dtConfigTypes)
			.set(updateData)
			.where(eq(dtConfigTypes.id, id))
			.returning();

		if (!updatedConfigType) {
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "配置类型不存在",
				data: null,
			};
			return notFoundResponse;
		}

		const response: JsonVO<typeof updatedConfigType> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: updatedConfigType,
		};
		return response;
	} catch (error: any) {
		console.error("[Config Type Update] Error:", error);
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
