/**
 * @file Repairs Have Done 列表接口
 * @description Repairs Have Done list API
 * POST /api/property-manage/repairs-manage/repairs-have-done/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { rpRepairOrders } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { RepairsHaveDoneListItem, RepairsHaveDoneQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	workOrderNumber: z.string().optional(),
	reporter: z.string().optional(),
	repairPhone: z.string().optional(),
	repairType: z.string().optional(),
	maintenanceType: z.string().optional(),
	repairStatus: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<RepairsHaveDoneListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			workOrderNumber: body.workOrderNumber === "" ? undefined : body.workOrderNumber,
			reporter: body.reporter === "" ? undefined : body.reporter,
			repairPhone: body.repairPhone === "" ? undefined : body.repairPhone,
			repairType: body.repairType === "" ? undefined : body.repairType,
			maintenanceType: body.maintenanceType === "" ? undefined : body.maintenanceType,
			repairStatus: body.repairStatus === "" ? undefined : body.repairStatus,
		};

		const query = querySchema.parse(rawQuery);

		const db = useDb(event);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		// 移除 deletedAt 检查，因为表结构可能没有此字段

		// 已完成的工单
		conditions.push(eq(rpRepairOrders.status, "completed"));

		if (query.workOrderNumber) {
			conditions.push(like(rpRepairOrders.workOrderNumber, `%${query.workOrderNumber}%`));
		}

		if (query.reporter) {
			conditions.push(like(rpRepairOrders.reporterName, `%${query.reporter}%`));
		}

		if (query.repairPhone) {
			conditions.push(like(rpRepairOrders.contactPhone, `%${query.repairPhone}%`));
		}

		if (query.repairType) {
			conditions.push(eq(rpRepairOrders.repairType, query.repairType));
		}

		if (query.maintenanceType) {
			conditions.push(eq(rpRepairOrders.maintenanceType, query.maintenanceType));
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
				appointmentTime: rpRepairOrders.appointmentTime,
				status: rpRepairOrders.status,
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
		const list: RepairsHaveDoneListItem[] = data.map((item) => ({
			id: item.id || "",
			workOrderNumber: item.workOrderNumber || "",
			location: item.repairLocation || "",
			repairType: item.repairType || "",
			maintenanceType: item.maintenanceType || "",
			reporter: item.reporterName || "",
			contactInfo: item.contactPhone || "",
			appointmentTime: item.appointmentTime ? formatDateTime(item.appointmentTime) : "",
			status: item.status || "completed",
			remark: item.remark || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<RepairsHaveDoneListItem>> = {
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
		console.error("[RepairsHaveDone List] Error:", error);
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
