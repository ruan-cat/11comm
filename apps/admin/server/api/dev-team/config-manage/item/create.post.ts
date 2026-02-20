/**
 * 创建配置项 API
 * @description 创建新的配置项记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { dtConfigItems, insertDtConfigItemSchema } from "@01s-11comm/type";
import type { NewDtConfigItem, JsonVO } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		const body = (await readValidatedBody(event, insertDtConfigItemSchema.parse)) as unknown as NewDtConfigItem;

		const [newConfigItem] = await db.insert(dtConfigItems).values(body).returning();

		const response: JsonVO<typeof newConfigItem> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: newConfigItem,
		};
		return response;
	} catch (error: any) {
		console.error("[Config Item Create] Error:", error);
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
