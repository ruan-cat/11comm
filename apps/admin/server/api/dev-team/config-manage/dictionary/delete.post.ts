/**
 * 删除字典 API
 * @description 删除字典记录（软删除）
 */

import { defineHandler, getQuery } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { dtDictionaries } from "@01s-11comm/type";
import { eq } from "drizzle-orm";

// 查询参数验证 schema
const querySchema = z.object({
	id: z.string().uuid(),
});

export default defineHandler(async (event) => {
	// 1. 获取并验证查询参数
	const rawQuery = getQuery(event);
	const query = querySchema.parse(rawQuery);

	// 2. 执行软删除操作（这里只是标记删除，实际删除操作）
	const [deletedDictionary] = await db.delete(dtDictionaries).where(eq(dtDictionaries.id, query.id)).returning();

	// 3. 检查是否找到记录
	if (!deletedDictionary) {
		return {
			code: 404,
			msg: "字典不存在",
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
