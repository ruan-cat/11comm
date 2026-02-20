/**
 * 创建配置中心 API
 * @description 创建新的配置中心记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { dtConfigs, insertDtConfigSchema } from "@01s-11comm/type";
import type { NewDtConfig, JsonVO } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		const body = (await readValidatedBody(event, insertDtConfigSchema.parse)) as unknown as NewDtConfig;

		const [newConfig] = await db.insert(dtConfigs).values(body).returning();

		const response: JsonVO<typeof newConfig> = {
			success: true,
			code: 200,
			message: "创建成功",
			data: newConfig,
		};
		return response;
	} catch (error: any) {
		console.error("[Config Center Create] Error:", error);
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
