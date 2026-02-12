/**
 * 创建配置中心 API
 * @description 创建新的配置中心记录
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { db } from "server/db";
import { dtConfigs, insertDtConfigSchema } from "@01s-11comm/type";
import type { NewDtConfig } from "@01s-11comm/type";

export default defineHandler(async (event) => {
	const body = (await readValidatedBody(event, insertDtConfigSchema.parse)) as unknown as NewDtConfig;

	const [newConfig] = await db.insert(dtConfigs).values(body).returning();

	// 3. 返回标准响应格式
	return {
		code: 200,
		msg: "创建成功",
		data: newConfig,
	};
});
