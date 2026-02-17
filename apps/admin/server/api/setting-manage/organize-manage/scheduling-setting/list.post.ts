/**
 * @file 组织管理-排班设置-列表接口
 * @description Scheduling setting list API
 * POST /api/setting-manage/organize-manage/scheduling-setting/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { smSchedulingSettings } from "@01s-11comm/type";
import type { JsonVO, PageDTO, SchedulingSettingListQuery } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	name: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		const body = (await readBody(event)) as any;
		const rawQuery = {
			page: body.pageIndex || body.page || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.page - 1) * query.pageSize;

		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(smSchedulingSettings);

		const total = Number(countResult[0]?.total || 0);

		const data = await db
			.select({
				id: smSchedulingSettings.id,
				schedulingMode: smSchedulingSettings.schedulingMode,
				applicablePosition: smSchedulingSettings.applicablePosition,
				rotationCycle: smSchedulingSettings.rotationCycle,
				createdAt: smSchedulingSettings.createdAt,
				updatedAt: smSchedulingSettings.updatedAt,
			})
			.from(smSchedulingSettings)
			.orderBy(desc(smSchedulingSettings.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		const list = data.map((item) => ({
			id: item.id,
			name: item.applicablePosition || "",
			type: item.schedulingMode || "",
			cycle: item.rotationCycle || "",
			effectiveTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			staff: "",
			status: "enabled",
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<any>> = {
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
		console.error("[Scheduling Setting List] Error:", error);
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
