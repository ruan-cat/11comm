/**
 * @file Outstanding Fees Analysis 列表接口
 * @description Outstanding Fees Analysis list API
 * POST /api/property-manage/report-manage/outstanding-fees-analysis/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { rptOutstandingFees } from "@01s-11comm/type";
import type {
	JsonVO,
	PageDTO,
	OutstandingFeesAnalysisListItem,
	OutstandingFeesAnalysisQueryParams,
} from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, and } from "drizzle-orm";

import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	houseNumberContractName: z.string().optional(),
	ownerName: z.string().optional(),
	ownerPhone: z.string().optional(),
	feeItem: z.string().optional(),
	community: z.string().optional(),
	building: z.string().optional(),
	unit: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OutstandingFeesAnalysisListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<OutstandingFeesAnalysisQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			houseNumberContractName: body.houseNumberContractName,
			ownerName: body.ownerName,
			ownerPhone: body.ownerPhone,
			feeItem: body.feeItem,
			community: body.community,
			building: body.building,
			unit: body.unit,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 构建查询条件
		const conditions = [];

		if (query.feeItem) {
			conditions.push(like(rptOutstandingFees.expenseItem, `%${query.feeItem}%`));
		}

		if (query.community) {
			conditions.push(like(rptOutstandingFees.community, `%${query.community}%`));
		}

		if (query.building) {
			conditions.push(like(rptOutstandingFees.building, `%${query.building}%`));
		}

		// 查询总数
		const countResult = await useDb(event)
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptOutstandingFees);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await useDb(event)
			.select({
				id: rptOutstandingFees.id,
				agingBucket: rptOutstandingFees.agingBucket,
				outstandingAmount: rptOutstandingFees.outstandingAmount,
				householdCount: rptOutstandingFees.householdCount,
				community: rptOutstandingFees.community,
				building: rptOutstandingFees.building,
				expenseItem: rptOutstandingFees.expenseItem,
				remark: rptOutstandingFees.remark,
				createTime: rptOutstandingFees.createTime,
				updateTime: rptOutstandingFees.updateTime,
			})
			.from(rptOutstandingFees)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(rptOutstandingFees.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: OutstandingFeesAnalysisListItem[] = data.map((item) => ({
			id: item.id || "",
			community: item.community || "",
			building: item.building || "",
			unit: "",
			houseNumberContractName: "",
			ownerName: "",
			ownerPhone: "",
			feeItem: item.expenseItem || "",
			totalUncollectedAmount: item.outstandingAmount || "0",
			currentUncollectedAmount: "",
			historicalUncollectedAmount: "",
			latestReceivableMonth: item.agingBucket || "",
			statisticsTime: formatDateTime(item.createTime),
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<OutstandingFeesAnalysisListItem>> = {
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
		console.error("[Outstanding Fees Analysis List] Error:", error);
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
