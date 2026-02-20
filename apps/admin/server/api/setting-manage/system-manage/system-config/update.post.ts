/**
 * @file 系统管理-系统配置-更新系统配置接口
 * @description System config update API
 * POST /api/setting-manage/system-manage/system-config/update
 */

import { defineHandler, readValidatedBody } from "nitro/h3";
import { useDb } from "server/db";
import { smSystemConfigs } from "@01s-11comm/type";
import { updateSmSystemConfigSchema, type SmSystemConfigVO } from "@01s-11comm/type";
import type { JsonVO } from "@01s-11comm/type";
import { eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

export default defineHandler(async (event): Promise<JsonVO<SmSystemConfigVO>> => {
	const db = useDb(event);
	try {
		const body = (await readValidatedBody(event, updateSmSystemConfigSchema.parse)) as unknown as {
			id: string;
			[key: string]: any;
		};

		/** 验证数据 */
		const validatedData = updateSmSystemConfigSchema.parse(body);
		const { id, ...updateData } = validatedData;

		/** 更新数据 */
		const result = await db.update(smSystemConfigs).set(updateData).where(eq(smSystemConfigs.id, id)).returning();

		if (!result[0]) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 404,
				message: "记录不存在",
				data: null,
			};
			return errorResponse;
		}

		/** 映射 createTime/updateTime (Date -> string) */
		const mappedData: SmSystemConfigVO = {
			...result[0],
			createTime: formatDateTime(result[0].createTime),
			updateTime: formatDateTime(result[0].updateTime),
		};

		const response: JsonVO<SmSystemConfigVO> = {
			success: true,
			code: 200,
			message: "更新成功",
			data: mappedData,
		};
		return response;
	} catch (error: any) {
		console.error("[System Config Update] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "更新失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
