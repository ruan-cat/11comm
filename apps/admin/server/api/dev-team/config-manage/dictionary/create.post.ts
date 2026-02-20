/**
 * 创建字典 API
 * @description 创建新的字典记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { dtDictionaries, insertDtDictionarySchema } from "@01s-11comm/type";
import type { NewDtDictionary, JsonVO } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		const body = (await readValidatedBody(event, insertDtDictionarySchema.parse)) as unknown as NewDtDictionary;

		const [newDictionary] = await db.insert(dtDictionaries).values(body).returning();

		const response: JsonVO<typeof newDictionary> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: newDictionary,
		};
		return response;
	} catch (error: any) {
		console.error("[Dictionary Create] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "创建失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
