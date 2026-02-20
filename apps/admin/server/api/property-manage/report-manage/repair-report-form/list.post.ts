/**
 * @file Repair Report Form 列表接口
 * @description Repair Report Form list API
 * POST /api/property-manage/report-manage/repair-report-form/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { rptRepairReports } from "@01s-11comm/type";
import type { JsonVO, PageDTO, RepairReportFormListItem, RepairReportFormQueryParams } from "@01s-11comm/type";
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
	reporter: z.string().optional(),
	reporterPhone: z.string().optional(),
	community: z.string().optional(),
	reportTimeStart: z.string().optional(),
	reportTimeEnd: z.string().optional(),
	feeStatus: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<RepairReportFormListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<RepairReportFormQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			repairType: body.repairType,
			repairStatus: body.repairStatus,
			urgencyLevel: body.urgencyLevel,
			reporter: body.reporter,
			reporterPhone: body.reporterPhone,
			community: body.community,
			reportTimeStart: body.reportTimeStart,
			reportTimeEnd: body.reportTimeEnd,
			feeStatus: body.feeStatus,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 查询总数
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptRepairReports);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await db
			.select({
				id: rptRepairReports.id,
				totalRepairs: rptRepairReports.totalRepairs,
				completedCount: rptRepairReports.completedCount,
				pendingCount: rptRepairReports.pendingCount,
				avgProcessingTime: rptRepairReports.avgProcessingTime,
				satisfactionRate: rptRepairReports.satisfactionRate,
				dissatisfactionReasons: rptRepairReports.dissatisfactionReasons,
				remark: rptRepairReports.remark,
				createTime: rptRepairReports.createTime,
				updateTime: rptRepairReports.updateTime,
			})
			.from(rptRepairReports)
			.orderBy(desc(rptRepairReports.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: RepairReportFormListItem[] = data.map((item) => ({
			id: item.id || "",
			community: "",
			repairOrderNumber: item.id || "",
			repairType: "",
			urgencyLevel: "",
			reporter: "",
			reporterPhone: "",
			repairAddress: "",
			reportTime: item.createTime ? formatDateTime(item.createTime) : "",
			handler: "",
			processor: "",
			feeStatus: "",
			repairStatus: item.pendingCount ? "待处理" : "已完成",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<RepairReportFormListItem>> = {
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
		console.error("[Repair Report Form List] Error:", error);
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
