/**
 * @file Parking Space Structure Diagram 列表接口
 * @description Parking Space Structure Diagram list API
 * POST /api/property-manage/community-manage/parking-space-structure-diagram/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { pkCarports } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	parkingLotId: z.string().uuid().optional(),
	carportNumber: z.string().optional(),
	carportType: z.string().optional(),
	status: z.string().optional(),
	ownerName: z.string().optional(),
	contactPhone: z.string().optional(),
	boundVehicle: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数：映射 pageIndex，空字符串清洗为 undefined */
		const rawQuery = {
			...body,
			pageIndex: body.pageIndex || 1,
			parkingLotId: body.parkingLotId === "" ? undefined : body.parkingLotId,
			carportNumber: body.carportNumber === "" ? undefined : body.carportNumber,
			carportType: body.carportType === "" ? undefined : body.carportType,
			status: body.status === "" ? undefined : body.status,
			ownerName: body.ownerName === "" ? undefined : body.ownerName,
			contactPhone: body.contactPhone === "" ? undefined : body.contactPhone,
			boundVehicle: body.boundVehicle === "" ? undefined : body.boundVehicle,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.parkingLotId) {
			conditions.push(eq(pkCarports.parkingLotId, query.parkingLotId));
		}

		if (query.carportNumber) {
			conditions.push(like(pkCarports.carportNumber, `%${query.carportNumber}%`));
		}

		if (query.carportType) {
			conditions.push(like(pkCarports.carportType, `%${query.carportType}%`));
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

		if (query.boundVehicle) {
			conditions.push(like(pkCarports.boundVehicle, `%${query.boundVehicle}%`));
		}

		/** 计算分页参数 */
		const offset = (query.pageIndex - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(pkCarports)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: pkCarports.id,
				parkingLotId: pkCarports.parkingLotId,
				carportNumber: pkCarports.carportNumber,
				carportType: pkCarports.carportType,
				area: pkCarports.area,
				status: pkCarports.status,
				ownerId: pkCarports.ownerId,
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
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(pkCarports.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<(typeof data)[number]>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list: data,
				total,
				pageSize: query.pageSize,
				pageIndex: query.pageIndex,
				totalPages,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[Parking Space Structure Diagram List] Error:", error);
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
