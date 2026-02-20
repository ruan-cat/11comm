/**
 * 更新字典 API
 * @description 更新字典记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { dtDictionaries, updateDtDictionarySchema } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		const body = await readValidatedBody(event, updateDtDictionarySchema.parse);
		const { id, ...updateData } = body;

		/** 执行更新操作 - 只更新提供的字段 */
		const [updatedDictionary] = await db
			.update(dtDictionaries)
			.set(updateData)
			.where(eq(dtDictionaries.id, id))
			.returning();

		if (!updatedDictionary) {
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "字典不存在",
				data: null,
			};
			return notFoundResponse;
		}

		const response: JsonVO<typeof updatedDictionary> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: updatedDictionary,
		};
		return response;
	} catch (error: any) {
		console.error("[Dictionary Update] Error:", error);
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
