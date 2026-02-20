/**
 * @file 组织表-列表接口管理-排班
 * @description Working schedule list API
 * POST /api/setting-manage/organize-manage/working-schedule/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { smWorkingSchedules, smStaff, smShifts } from "@01s-11comm/type";
import type { JsonVO, PageDTO, WorkingScheduleListQuery } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	name: z.string().optional(),
	type: z.string().optional(),
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

		const db = useDb(event);

		// 关联查询员工表和班次表
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(smWorkingSchedules)
			.leftJoin(smStaff, eq(smWorkingSchedules.staffId, smStaff.id))
			.leftJoin(smShifts, eq(smWorkingSchedules.shiftId, smShifts.id));

		const total = Number(countResult[0]?.total || 0);

		const data = await db
			.select({
				id: smWorkingSchedules.id,
				staffId: smWorkingSchedules.staffId,
				shiftId: smWorkingSchedules.shiftId,
				scheduleDate: smWorkingSchedules.scheduleDate,
				name: smWorkingSchedules.name,
				type: smWorkingSchedules.type,
				startTime: smWorkingSchedules.startTime,
				endTime: smWorkingSchedules.endTime,
				weekday: smWorkingSchedules.weekday,
				managerName: smWorkingSchedules.managerName,
				phone: smWorkingSchedules.phone,
				enabled: smWorkingSchedules.enabled,
				description: smWorkingSchedules.description,
				workDate: smWorkingSchedules.workDate,
				status: smWorkingSchedules.status,
				createTime: smWorkingSchedules.createTime,
				updateTime: smWorkingSchedules.updateTime,
				// 关联字段
				staffName: smStaff.name,
				shiftName: smShifts.shiftName,
			})
			.from(smWorkingSchedules)
			.leftJoin(smStaff, eq(smWorkingSchedules.staffId, smStaff.id))
			.leftJoin(smShifts, eq(smWorkingSchedules.shiftId, smShifts.id))
			.orderBy(desc(smWorkingSchedules.createTime))
			.limit(query.pageSize)
			.offset(offset);

		const list = data.map((item) => ({
			id: item.id,
			name: item.name || "",
			type: item.type || "",
			startTime: item.startTime || "",
			endTime: item.endTime || "",
			weekday: item.weekday || 0,
			managerName: item.managerName || "",
			phone: item.phone || "",
			enabled: item.enabled ?? true,
			description: item.description || "",
			staffId: item.staffId || "",
			shiftId: item.shiftId || "",
			workDate: item.workDate || "",
			status: item.status || "",
			remark: "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
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
		console.error("[Working Schedule List] Error:", error);
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
