/**
 * @file Patrol Report 列表接口
 * @description Patrol Report list API
 * POST /api/property-manage/report-manage/patrol-report/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { rptPatrolReports } from "@01s-11comm/type";
import type { JsonVO, PageDTO, PatrolReportListItem, PatrolReportQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, and } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	patrolName: z.string().optional(),
	patrolType: z.string().optional(),
	patrolLevel: z.string().optional(),
	responsiblePerson: z.string().optional(),
	status: z.string().optional(),
	community: z.string().optional(),
	patrolTimeStart: z.string().optional(),
	patrolTimeEnd: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PatrolReportListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<PatrolReportQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			patrolName: body.patrolName,
			patrolType: body.patrolType,
			patrolLevel: body.patrolLevel,
			responsiblePerson: body.responsiblePerson,
			status: body.status,
			community: body.community,
			patrolTimeStart: body.patrolTimeStart,
			patrolTimeEnd: body.patrolTimeEnd,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 构建查询条件
		const conditions = [];

		if (query.patrolType) {
			conditions.push(like(rptPatrolReports.dimension, `%${query.patrolType}%`));
		}

		if (query.patrolLevel) {
			conditions.push(like(rptPatrolReports.period, `%${query.patrolLevel}%`));
		}

		// 查询总数
		const countResult = await useDb(event)
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptPatrolReports);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await useDb(event)
			.select({
				id: rptPatrolReports.id,
				plannedTasks: rptPatrolReports.plannedTasks,
				completedTasks: rptPatrolReports.completedTasks,
				abnormalTasks: rptPatrolReports.abnormalTasks,
				onTimeCompletionRate: rptPatrolReports.onTimeCompletionRate,
				period: rptPatrolReports.period,
				dimension: rptPatrolReports.dimension,
				remark: rptPatrolReports.remark,
				createTime: rptPatrolReports.createTime,
				updateTime: rptPatrolReports.updateTime,
			})
			.from(rptPatrolReports)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(rptPatrolReports.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: PatrolReportListItem[] = data.map((item) => ({
			id: item.id || "",
			community: "",
			patrolNumber: item.id || "",
			patrolName: item.dimension || "",
			patrolType: item.period || "",
			patrolLevel: item.dimension || "",
			responsiblePerson: "",
			patrolTime: item.createTime ? formatDateTime(item.createTime) : "",
			status: item.completedTasks ? "已完成" : "未完成",
			abnormalCount: item.abnormalTasks || 0,
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<PatrolReportListItem>> = {
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
		console.error("[Patrol Report List] Error:", error);
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
