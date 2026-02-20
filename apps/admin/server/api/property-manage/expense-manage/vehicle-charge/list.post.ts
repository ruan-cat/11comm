/**
 * @file Vehicle Charge 列表接口
 * @description Vehicle Charge list API
 * POST /api/property-manage/expense-manage/vehicle-charge/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { exVehicleCharges } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	name: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
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

		if (query.name) {
			conditions.push(like(exVehicleCharges.ownerName, `%${query.name}%`));
		}

		if (query.status) {
			conditions.push(eq(exVehicleCharges.status, query.status as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: exVehicleCharges.createTime,
			updateTime: exVehicleCharges.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await useDb(event)
			.select({ total: sql<number>`count(*)` })
			.from(exVehicleCharges)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await useDb(event)
			.select({
				id: exVehicleCharges.id,
				vehicleId: exVehicleCharges.vehicleId,
				licensePlate: exVehicleCharges.licensePlate,
				carportNumber: exVehicleCharges.carportNumber,
				expenseType: exVehicleCharges.expenseType,
				receivableAmount: exVehicleCharges.receivableAmount,
				receivedAmount: exVehicleCharges.receivedAmount,
				billingPeriod: exVehicleCharges.billingPeriod,
				status: exVehicleCharges.status,
				remark: exVehicleCharges.remark,
				ownerName: exVehicleCharges.ownerName,
				parkingSpaceStatus: exVehicleCharges.parkingSpaceStatus,
				createTime: exVehicleCharges.createTime,
				updateTime: exVehicleCharges.updateTime,
			})
			.from(exVehicleCharges)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			name: item.ownerName || "",
			status: item.status || "unpaid",
			remark: item.remark || "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<(typeof list)[number]>> = {
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
		console.error("[Vehicle Charge List] Error:", error);
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
