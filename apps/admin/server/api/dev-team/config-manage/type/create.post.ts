/**
 * 创建配置类型 API
 * @description 创建新的配置类型记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtConfigTypes, insertDtConfigTypeSchema } from "@01s-11comm/type";
import type { NewDtConfigType } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	const body = (await readValidatedBody(event, insertDtConfigTypeSchema.parse)) as unknown as NewDtConfigType;

	const [newConfigType] = await db.insert(dtConfigTypes).values(body).returning();

	// 3. 返回标准响应格式
	return {
		code: 200,
		msg: "创建成功",
		data: newConfigType,
	};
});
