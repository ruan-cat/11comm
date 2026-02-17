/**
 * @file Owner Vehicle 列表接口
 * @description Owner Vehicle list API
 * POST /api/property-manage/parking-manage/owner-vehicle/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { pkOwnerVehicles, pkCarports, hpOwners } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { OwnerVehicleListItem, OwnerVehicleQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq, isNull } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	licensePlate: z.string().optional(),
	plateType: z.string().optional(),
	vehicleType: z.string().optional(),
	brand: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OwnerVehicleListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			licensePlate: body.licensePlate === "" ? undefined : body.licensePlate,
			brand: body.carBrand === "" ? undefined : body.carBrand,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		// 软删除过滤：只查询未删除的记录
		conditions.push(isNull(pkOwnerVehicles.deletedAt));

		if (query.licensePlate) {
			conditions.push(like(pkOwnerVehicles.licensePlate, `%${query.licensePlate}%`));
		}

		if (query.plateType) {
			conditions.push(eq(pkOwnerVehicles.plateType, query.plateType));
		}

		if (query.vehicleType) {
			conditions.push(eq(pkOwnerVehicles.vehicleType, query.vehicleType));
		}

		if (query.brand) {
			conditions.push(like(pkOwnerVehicles.brand, `%${query.brand}%`));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: pkOwnerVehicles.createdAt,
			updatedAt: pkOwnerVehicles.updatedAt,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(pkOwnerVehicles)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: pkOwnerVehicles.id,
				ownerId: pkOwnerVehicles.ownerId,
				carportId: pkOwnerVehicles.carportId,
				licensePlate: pkOwnerVehicles.licensePlate,
				plateType: pkOwnerVehicles.plateType,
				vehicleType: pkOwnerVehicles.vehicleType,
				vehicleColor: pkOwnerVehicles.vehicleColor,
				brand: pkOwnerVehicles.brand,
				relatedHouse: pkOwnerVehicles.relatedHouse,
				validityStart: pkOwnerVehicles.validityStart,
				validityEnd: pkOwnerVehicles.validityEnd,
				createdAt: pkOwnerVehicles.createdAt,
				updatedAt: pkOwnerVehicles.updatedAt,
			})
			.from(pkOwnerVehicles)
			.leftJoin(pkCarports, eq(pkOwnerVehicles.carportId, pkCarports.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: OwnerVehicleListItem[] = data.map((item) => ({
			licensePlate: item.licensePlate || "",
			memberVehicle: item.brand || "",
			houseNumber: item.relatedHouse || "",
			licensePlateType: item.plateType || "",
			vehicleType: item.vehicleType || "",
			color: item.vehicleColor || "",
			owner: "", // 需要关联查询业主信息
			parkingSpace: item.carportId ? "已绑定" : "未绑定",
			validityPeriod: item.validityStart && item.validityEnd ? `${item.validityStart} ~ ${item.validityEnd}` : "",
			status: "启用",
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<OwnerVehicleListItem>> = {
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
		console.error("[OwnerVehicle List] Error:", error);
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
