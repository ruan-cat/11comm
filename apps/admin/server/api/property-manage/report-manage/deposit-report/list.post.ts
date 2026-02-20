/**
 * @file Deposit Report 列表接口
 * @description Deposit Report list API
 * POST /api/property-manage/report-manage/deposit-report/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { rptDepositReports } from "@01s-11comm/type";
import type { JsonVO, PageDTO, DepositReportListItem, DepositReportQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql } from "drizzle-orm";

import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	name: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<DepositReportListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<DepositReportQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			name: body.name,
			status: body.status,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 查询总数
		const countResult = await useDb(event)
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptDepositReports);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await useDb(event)
			.select({
				id: rptDepositReports.id,
				depositType: rptDepositReports.depositType,
				collectedTotal: rptDepositReports.collectedTotal,
				returnedTotal: rptDepositReports.returnedTotal,
				holdingTotal: rptDepositReports.holdingTotal,
				periodStart: rptDepositReports.periodStart,
				periodEnd: rptDepositReports.periodEnd,
				remark: rptDepositReports.remark,
				createTime: rptDepositReports.createTime,
				updateTime: rptDepositReports.updateTime,
			})
			.from(rptDepositReports)
			.orderBy(desc(rptDepositReports.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: DepositReportListItem[] = data.map((item) => ({
			id: item.id || "",
			name: item.depositType || "",
			status: item.collectedTotal ? "正常" : "无数据",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
			remark: item.remark || "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<DepositReportListItem>> = {
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
		console.error("[Deposit Report List] Error:", error);
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
