/**
 * 删除配置类型 API
 * @description 删除配置类型记录
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigTypes } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

/** 请求体验证 schema */
const bodySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	try {
		/** 获取并验证请求体参数 */
		const body = (await readBody(event)) as any;
		const { id } = bodySchema.parse(body);

		/** 执行删除操作 */
		const [deletedConfigType] = await db.delete(dtConfigTypes).where(eq(dtConfigTypes.id, id)).returning();

		if (!deletedConfigType) {
			const notFoundResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "配置类型不存在",
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
		console.error("[Config Type Delete] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "删除失败",
			data: null,
			error: error.message || String(error),
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
