/**
 * @file register protocol-列表接口
 * @description register protocol list API
 * POST /api/operation-team/system-manage/register-protocol/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { smRegisterProtocols } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	protocolType: z.string().optional(),
	protocolTitle: z.string().optional(),
	status: z.enum(["enabled", "disabled"]).optional(),
});

export default defineHandler(async (event) => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数：映射 pageIndex → page，空字符串清洗为 undefined */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			protocolType: body.protocolType === "" ? undefined : body.protocolType,
			protocolTitle: body.protocolTitle === "" ? undefined : body.protocolTitle,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		const db = useDb(event);

		/** 构建查询条件 */
		const conditions = [];

		if (query.protocolType) {
			conditions.push(like(smRegisterProtocols.protocolType, `%${query.protocolType}%`));
		}

		if (query.protocolTitle) {
			conditions.push(like(smRegisterProtocols.protocolTitle, `%${query.protocolTitle}%`));
		}

		if (query.status) {
			conditions.push(eq(smRegisterProtocols.status, query.status));
		}

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(smRegisterProtocols)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select()
			.from(smRegisterProtocols)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(smRegisterProtocols.createTime))
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式以匹配前端期望 */
		const list = data.map((item) => ({
			...item,
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<(typeof list)[number]>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list,
				total,
				pageSize: query.pageSize,
				pageIndex: query.page,
				totalPages,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[Register Protocol List] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
