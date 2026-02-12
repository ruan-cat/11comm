/**
 * 删除配置类型 API
 * @description 删除配置类型记录
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigTypes } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

// 查询参数验证 schema
const querySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	// 1. 获取并验证查询参数
	const rawQuery = getQuery(event);
	const query = querySchema.parse(rawQuery);

	// 2. 执行删除操作
	const [deletedConfigType] = await db.delete(dtConfigTypes).where(eq(dtConfigTypes.id, query.id)).returning();

	// 3. 检查是否找到记录
	if (!deletedConfigType) {
		return {
			code: 404,
			msg: "配置类型不存在",
			data: null,
		};
	}

	// 4. 返回标准响应格式
	return {
		code: 200,
		msg: "删除成功",
		data: null,
	};
});
