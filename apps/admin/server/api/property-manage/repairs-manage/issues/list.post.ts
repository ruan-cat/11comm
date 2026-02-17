/**
 * @file Issues 列表接口
 * @description Issues list API
 * POST /api/property-manage/repairs-manage/issues/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { rpRepairOrders, rpRepairOrderHistories, rpReturnVisits } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { IssuesListItem, IssuesQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq, isNull, or } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	workOrderNumber: z.string().optional(),
	reporter: z.string().optional(),
	reporterPhone: z.string().optional(),
	repairType: z.string().optional(),
	repairLocation: z.string().optional(),
	maintenanceType: z.string().optional(),
	status: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<IssuesListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			workOrderNumber: body.workOrderNumber === "" ? undefined : body.workOrderNumber,
			reporter: body.reporter === "" ? undefined : body.reporter,
			reporterPhone: body.reporterPhone === "" ? undefined : body.reporterPhone,
			repairType: body.repairType === "" ? undefined : body.repairType,
			repairLocation: body.repairLocation === "" ? undefined : body.repairLocation,
			maintenanceType: body.maintenanceType === "" ? undefined : body.maintenanceType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		// 移除 deletedAt 检查，因为表结构可能没有此字段

		if (query.workOrderNumber) {
			conditions.push(like(rpRepairOrders.workOrderNumber, `%${query.workOrderNumber}%`));
		}

		if (query.reporter) {
			conditions.push(like(rpRepairOrders.reporterName, `%${query.reporter}%`));
		}

		if (query.reporterPhone) {
			conditions.push(like(rpRepairOrders.contactPhone, `%${query.reporterPhone}%`));
		}

		if (query.repairType) {
			conditions.push(eq(rpRepairOrders.repairType, query.repairType));
		}

		if (query.repairLocation) {
			conditions.push(like(rpRepairOrders.repairLocation, `%${query.repairLocation}%`));
		}

		if (query.maintenanceType) {
			conditions.push(eq(rpRepairOrders.maintenanceType, query.maintenanceType));
		}

		if (query.status) {
			conditions.push(eq(rpRepairOrders.status, query.status as any));
		}

		if (query.startTime) {
			conditions.push(sql`${rpRepairOrders.createTime} >= ${new Date(query.startTime)}`);
		}

		if (query.endTime) {
			conditions.push(sql`${rpRepairOrders.createTime} <= ${new Date(query.endTime)}`);
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: rpRepairOrders.createTime,
			updateTime: rpRepairOrders.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(rpRepairOrders)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: rpRepairOrders.id,
				workOrderNumber: rpRepairOrders.workOrderNumber,
				repairType: rpRepairOrders.repairType,
				maintenanceType: rpRepairOrders.maintenanceType,
				reporterName: rpRepairOrders.reporterName,
				contactPhone: rpRepairOrders.contactPhone,
				repairLocation: rpRepairOrders.repairLocation,
				problemDescription: rpRepairOrders.problemDescription,
				appointmentTime: rpRepairOrders.appointmentTime,
				status: rpRepairOrders.status,
				assigner: rpRepairOrders.assigner,
				repairPerson: rpRepairOrders.repairPerson,
				plannedCompletionTime: rpRepairOrders.plannedCompletionTime,
				createTime: rpRepairOrders.createTime,
				updateTime: rpRepairOrders.updateTime,
				remark: rpRepairOrders.remark,
			})
			.from(rpRepairOrders)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: IssuesListItem[] = data.map((item) => ({
			id: item.id || "",
			workOrderCode: item.workOrderNumber || "",
			location: item.repairLocation || "",
			repairType: item.repairType || "",
			maintenanceType: item.maintenanceType || "",
			reporter: item.reporterName || "",
			contactInfo: item.contactPhone || "",
			appointmentTimeRange: item.appointmentTime ? formatDateTime(item.appointmentTime) : "",
			submitTime: item.createTime ? formatDateTime(item.createTime) : "",
			completeTime: item.plannedCompletionTime ? formatDateTime(item.plannedCompletionTime) : "",
			status: item.status || "pending",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			remark: item.remark || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<IssuesListItem>> = {
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
		console.error("[Issues List] Error:", error);
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
