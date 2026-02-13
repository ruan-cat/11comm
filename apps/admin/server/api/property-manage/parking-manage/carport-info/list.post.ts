/**
 * @file Carport Info 列表接口
 * @description Carport Info list API
 * POST /api/property-manage/parking-manage/carport-info/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { pkCarports, pkParkingLots } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { CarportInfoListItem, CarportInfoQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	carportNumber: z.string().optional(),
	carportType: z.string().optional(),
	status: z.string().optional(),
	ownerName: z.string().optional(),
	contactPhone: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<CarportInfoListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			carportNumber: body.parkingSpace === "" ? undefined : body.parkingSpace,
			carportType: body.parkingSpaceType === "" ? undefined : body.parkingSpaceType,
			status: body.parkingSpaceStatus === "" ? undefined : body.parkingSpaceStatus,
			ownerName: body.ownerName === "" ? undefined : body.ownerName,
			contactPhone: body.contactPhone === "" ? undefined : body.contactPhone,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.carportNumber) {
			conditions.push(like(pkCarports.carportNumber, `%${query.carportNumber}%`));
		}

		if (query.carportType) {
			conditions.push(eq(pkCarports.carportType, query.carportType));
		}

		if (query.status) {
			conditions.push(eq(pkCarports.status, query.status));
		}

		if (query.ownerName) {
			conditions.push(like(pkCarports.ownerName, `%${query.ownerName}%`));
		}

		if (query.contactPhone) {
			conditions.push(like(pkCarports.contactPhone, `%${query.contactPhone}%`));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: pkCarports.createdAt,
			updatedAt: pkCarports.updatedAt,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(pkCarports)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 - 关联停车场信息 */
		const data = await db
			.select({
				id: pkCarports.id,
				parkingLotId: pkCarports.parkingLotId,
				carportNumber: pkCarports.carportNumber,
				carportType: pkCarports.carportType,
				area: pkCarports.area,
				status: pkCarports.status,
				ownerName: pkCarports.ownerName,
				contactPhone: pkCarports.contactPhone,
				boundVehicle: pkCarports.boundVehicle,
				monthlyRent: pkCarports.monthlyRent,
				purchaseDate: pkCarports.purchaseDate,
				expiryDate: pkCarports.expiryDate,
				createdAt: pkCarports.createdAt,
				updatedAt: pkCarports.updatedAt,
			})
			.from(pkCarports)
			.leftJoin(pkParkingLots, eq(pkCarports.parkingLotId, pkParkingLots.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: CarportInfoListItem[] = data.map((item) => ({
			parkingLot: item.parkingLotId ? "停车场" : "", // 需要关联查询停车场名称
			parkingSpace: item.carportNumber || "",
			parkingSpaceStatus: item.status || "",
			parkingSpaceType: item.carportType || "",
			area: item.area?.toString() || "",
			ownerName: item.ownerName || "",
			contactPhone: item.contactPhone || "",
			vehicleNumber: item.boundVehicle || "",
			purchaseDate: item.purchaseDate || "",
			expiryDate: item.expiryDate || "",
			monthlyRent: Number(item.monthlyRent) || 0,
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<CarportInfoListItem>> = {
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
		console.error("[CarportInfo List] Error:", error);
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
