/**
 * @file Repairs Todo 列表接口
 * @description Repairs Todo list API
 * POST /api/property-manage/repairs-manage/repairs-todo/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { rpRepairOrders } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { RepairsTodoListItem, RepairsTodoQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq, isNull, or } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	name: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<RepairsTodoListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			name: body.name === "" ? undefined : body.name,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		// 移除 deletedAt 检查，因为表结构可能没有此字段

		// 待处理的工单: pending 或 processing
		conditions.push(or(eq(rpRepairOrders.status, "pending"), eq(rpRepairOrders.status, "processing")));

		if (query.name) {
			conditions.push(like(rpRepairOrders.workOrderNumber, `%${query.name}%`));
		}

		if (query.status) {
			conditions.push(eq(rpRepairOrders.status, query.status as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: rpRepairOrders.createdAt,
			updatedAt: rpRepairOrders.updatedAt,
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
				createdAt: rpRepairOrders.createdAt,
				updatedAt: rpRepairOrders.updatedAt,
				remark: rpRepairOrders.remark,
			})
			.from(rpRepairOrders)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: RepairsTodoListItem[] = data.map((item) => ({
			id: item.id || "",
			workOrderNumber: item.workOrderNumber || "",
			location: item.repairLocation || "",
			repairType: item.repairType || "",
			maintenanceType: item.maintenanceType || "",
			reporter: item.reporterName || "",
			contactInfo: item.contactPhone || "",
			appointmentTime: item.appointmentTime ? new Date(item.appointmentTime).toISOString() : "",
			status: item.status || "pending",
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
			remark: item.remark || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<RepairsTodoListItem>> = {
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
		console.error("[RepairsTodo List] Error:", error);
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
