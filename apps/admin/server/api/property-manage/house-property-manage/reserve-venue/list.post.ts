/**
 * @file Reserve Venue 列表接口
 * @description Reserve Venue list API
 * POST /api/property-manage/house-property-manage/reserve-venue/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { hpReserveVenues } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ReserveVenueListItem, ReserveVenueQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	reserver: z.string().optional(),
	contactPhone: z.string().optional(),
	venueType: z.string().optional(),
	reservationStatus: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ReserveVenueListItem>>> => {
	try {
		const db = useDb(event);
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			reserver: body.reserver === "" ? undefined : body.reserver,
			contactPhone: body.contactPhone === "" ? undefined : body.contactPhone,
			venueType: body.venueType === "" ? undefined : body.venueType,
			reservationStatus: body.reservationStatus === "" ? undefined : body.reservationStatus,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.venueType) {
			conditions.push(eq(hpReserveVenues.venueType, query.venueType as any));
		}

		if (query.reservationStatus) {
			conditions.push(eq(hpReserveVenues.status, query.reservationStatus as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: hpReserveVenues.createTime,
			updateTime: hpReserveVenues.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(hpReserveVenues)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: hpReserveVenues.id,
				venueName: hpReserveVenues.venueName,
				venueType: hpReserveVenues.venueType,
				capacity: hpReserveVenues.capacity,
				openTime: hpReserveVenues.openTime,
				chargeStandard: hpReserveVenues.chargeStandard,
				status: hpReserveVenues.status,
				remark: hpReserveVenues.remark,
				createTime: hpReserveVenues.createTime,
				updateTime: hpReserveVenues.updateTime,
			})
			.from(hpReserveVenues)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: ReserveVenueListItem[] = data.map((item) => ({
			id: item.id,
			reserver: "", // 需要关联预约订单查询
			contactPhone: "",
			reservationTime: "",
			startTime: "",
			endTime: "",
			venueType: item.venueType || "",
			reservationStatus: item.status || "",
			numberOfUsers: item.capacity || 0,
			remark: item.remark || "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<ReserveVenueListItem>> = {
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
		console.error("[Reserve Venue List] Error:", error);
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
