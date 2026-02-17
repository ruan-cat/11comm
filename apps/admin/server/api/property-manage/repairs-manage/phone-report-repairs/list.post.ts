/**
 * @file Phone Report Repairs 列表接口
 * @description Phone Report Repairs list API
 * POST /api/property-manage/repairs-manage/phone-report-repairs/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { rpPhoneRepairReports, rpRepairOrders } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { PhoneReportRepairsListItem, PhoneReportRepairsQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq, isNull } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	workOrderNumber: z.string().optional(),
	reporter: z.string().optional(),
	contactPhone: z.string().optional(),
	repairType: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PhoneReportRepairsListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			workOrderNumber: body.workOrderNumber === "" ? undefined : body.workOrderNumber,
			reporter: body.reporter === "" ? undefined : body.reporter,
			contactPhone: body.contactPhone === "" ? undefined : body.contactPhone,
			repairType: body.repairType === "" ? undefined : body.repairType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		// 移除 deletedAt 检查，因为表结构可能没有此字段

		if (query.contactPhone) {
			conditions.push(like(rpPhoneRepairReports.callerPhone, `%${query.contactPhone}%`));
		}

		if (query.reporter) {
			conditions.push(like(rpPhoneRepairReports.receiver, `%${query.reporter}%`));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: rpPhoneRepairReports.createdAt,
			updatedAt: rpPhoneRepairReports.updatedAt,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(rpPhoneRepairReports)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: rpPhoneRepairReports.id,
				orderId: rpPhoneRepairReports.orderId,
				callerPhone: rpPhoneRepairReports.callerPhone,
				callTime: rpPhoneRepairReports.callTime,
				receiver: rpPhoneRepairReports.receiver,
				repairSummary: rpPhoneRepairReports.repairSummary,
				createdAt: rpPhoneRepairReports.createdAt,
				updatedAt: rpPhoneRepairReports.updatedAt,
			})
			.from(rpPhoneRepairReports)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: PhoneReportRepairsListItem[] = data.map((item) => ({
			id: item.id || "",
			workOrderNumber: item.orderId || "",
			location: "",
			repairType: item.repairSummary || "",
			reporter: item.receiver || "",
			contactInfo: item.callerPhone || "",
			appointmentTime: item.callTime ? formatDateTime(item.callTime) : "",
			overtimeTime: "",
			submitTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			status: item.orderId ? "processed" : "pending",
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
			remark: item.repairSummary || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<PhoneReportRepairsListItem>> = {
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
		console.error("[PhoneReportRepairs List] Error:", error);
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
