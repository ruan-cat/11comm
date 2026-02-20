/**
 * 创建配置类型 API
 * @description 创建新的配置类型记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { dtConfigTypes, insertDtConfigTypeSchema } from "@01s-11comm/type";
import type { NewDtConfigType, JsonVO } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		const body = (await readValidatedBody(event, insertDtConfigTypeSchema.parse)) as unknown as NewDtConfigType;

		const [newConfigType] = await db.insert(dtConfigTypes).values(body).returning();

		const response: JsonVO<typeof newConfigType> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: newConfigType,
		};
		return response;
	} catch (error: any) {
		console.error("[Config Type Create] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "创建失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
