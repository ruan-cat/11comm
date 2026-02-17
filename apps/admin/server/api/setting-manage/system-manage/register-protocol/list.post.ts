/**
 * @file 系统管理-注册协议-注册协议列表接口
 * @description Register protocol list API
 * POST /api/setting-manage/system-manage/register-protocol/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { smRegisterProtocols } from "@01s-11comm/type";
import type { JsonVO, PageDTO, SettingManagementRegisterProtocolDisplay } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<SettingManagementRegisterProtocolDisplay>>> => {
	try {
		const body = (await readBody(event)) as any;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 查询总数
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(smRegisterProtocols);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await db
			.select({
				id: smRegisterProtocols.id,
				protocolType: smRegisterProtocols.protocolType,
				protocolTitle: smRegisterProtocols.protocolTitle,
				protocolContent: smRegisterProtocols.protocolContent,
				version: smRegisterProtocols.version,
				status: smRegisterProtocols.status,
				createTime: smRegisterProtocols.createTime,
				updateTime: smRegisterProtocols.updateTime,
			})
			.from(smRegisterProtocols)
			.orderBy(desc(smRegisterProtocols.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射到前端类型 - 数据库表字段与前端类型字段不一致，需要适配
		const list: SettingManagementRegisterProtocolDisplay[] = data.map((item) => ({
			id: item.id,
			title: item.protocolTitle || "",
			content: item.protocolContent || "",
			version: item.version || "",
			status: item.status || "enabled",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<SettingManagementRegisterProtocolDisplay>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list,
				total,
				pageSize: query.pageSize,
				pageIndex: query.pageIndex,
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
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
		return errorResponse;
	}
});
