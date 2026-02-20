/**
 * @file Repair Reports Summary Table 列表接口
 * @description Repair Reports Summary Table list API
 * POST /api/property-manage/report-manage/repair-reports-summary-table/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { rptRepairSummaries } from "@01s-11comm/type";
import type {
	JsonVO,
	PageDTO,
	RepairReportsSummaryTableListItem,
	RepairReportsSummaryTableQueryParams,
} from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, and } from "drizzle-orm";

import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	repairType: z.string().optional(),
	repairStatus: z.string().optional(),
	urgencyLevel: z.string().optional(),
	community: z.string().optional(),
	statisticsStartTime: z.string().optional(),
	statisticsEndTime: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<RepairReportsSummaryTableListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<RepairReportsSummaryTableQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			repairType: body.repairType,
			repairStatus: body.repairStatus,
			urgencyLevel: body.urgencyLevel,
			community: body.community,
			statisticsStartTime: body.statisticsStartTime,
			statisticsEndTime: body.statisticsEndTime,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 查询总数
		const countResult = await useDb(event)
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptRepairSummaries);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await useDb(event)
			.select({
				id: rptRepairSummaries.id,
				repairTypeDistribution: rptRepairSummaries.repairTypeDistribution,
				workerWorkload: rptRepairSummaries.workerWorkload,
				repairCostStatistics: rptRepairSummaries.repairCostStatistics,
				remark: rptRepairSummaries.remark,
				createTime: rptRepairSummaries.createTime,
				updateTime: rptRepairSummaries.updateTime,
			})
			.from(rptRepairSummaries)
			.orderBy(desc(rptRepairSummaries.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: RepairReportsSummaryTableListItem[] = data.map((item) => ({
			id: item.id || "",
			community: "",
			repairType: "",
			repairCount: 0,
			processingCount: 0,
			completedCount: 0,
			unfinishedCount: 0,
			pendingRevisitCount: 0,
			dissatisfiedCount: 0,
			emergencyCount: 0,
			statisticsTime: item.createTime ? formatDateTime(item.createTime) : "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<RepairReportsSummaryTableListItem>> = {
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
		console.error("[Repair Reports Summary Table List] Error:", error);
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
