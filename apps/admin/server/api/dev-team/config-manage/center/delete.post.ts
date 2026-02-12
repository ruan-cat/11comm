/**
 * 删除配置中心 API
 * @description 删除配置中心记录
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtConfigs } from "@01s-11comm/type";
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
	const [deletedConfig] = await db.delete(dtConfigs).where(eq(dtConfigs.id, query.id)).returning();

	// 3. 检查是否找到记录
	if (!deletedConfig) {
		return {
			code: 404,
			msg: "配置中心不存在",
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
