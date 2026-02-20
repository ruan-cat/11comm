/**
 * 删除配置中心 API
 * @description 删除配置中心记录
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { dtConfigs } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

/** 请求体验证 schema */
const bodySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		/** 获取并验证请求体参数 */
		const body = (await readBody(event)) as any;
		const { id } = bodySchema.parse(body);

		/** 执行删除操作 */
		const [deletedConfig] = await db.delete(dtConfigs).where(eq(dtConfigs.id, id)).returning();

		if (!deletedConfig) {
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "配置中心不存在",
				data: null,
			};
			return notFoundResponse;
		}

		const response: JsonVO<null> = {
			success: true,
			code: 200,
			message: "删除成功",
			data: null,
		};
		return response;
	} catch (error: any) {
		console.error("[Config Center Delete] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "删除失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
