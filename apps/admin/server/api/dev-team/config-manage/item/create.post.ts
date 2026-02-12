/**
 * 创建配置项 API
 * @description 创建新的配置项记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtConfigItems, insertDtConfigItemSchema } from "@01s-11comm/type";
import type { NewDtConfigItem } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	const body = (await readValidatedBody(event, insertDtConfigItemSchema.parse)) as unknown as NewDtConfigItem;

	const [newConfigItem] = await db.insert(dtConfigItems).values(body).returning();

	// 3. 返回标准响应格式
	return {
		code: 200,
		msg: "创建成功",
		data: newConfigItem,
	};
});
