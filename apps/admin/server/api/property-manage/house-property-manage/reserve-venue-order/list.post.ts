/**
 * @file Reserve Venue Order 列表接口
 * @description Reserve Venue Order list API
 * POST /api/property-manage/house-property-manage/reserve-venue-order/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { hpReserveVenueOrders, hpReserveVenues } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ReserveVenueOrderListItem, ReserveVenueOrderQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	booker: z.string().optional(),
	contactPhone: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ReserveVenueOrderListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			booker: body.booker === "" ? undefined : body.booker,
			contactPhone: body.contactPhone === "" ? undefined : body.contactPhone,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.booker) {
			conditions.push(like(hpReserveVenueOrders.booker, `%${query.booker}%`));
		}

		if (query.contactPhone) {
			conditions.push(like(hpReserveVenueOrders.contactPhone, `%${query.contactPhone}%`));
		}

		if (query.status) {
			conditions.push(eq(hpReserveVenueOrders.status, query.status as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: hpReserveVenueOrders.createTime,
			updateTime: hpReserveVenueOrders.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(hpReserveVenueOrders)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 - 关联场地表 */
		const data = await db
			.select({
				id: hpReserveVenueOrders.id,
				venueId: hpReserveVenueOrders.venueId,
				booker: hpReserveVenueOrders.booker,
				contactPhone: hpReserveVenueOrders.contactPhone,
				timeSlot: hpReserveVenueOrders.timeSlot,
				status: hpReserveVenueOrders.status,
				remark: hpReserveVenueOrders.remark,
				reservationTime: hpReserveVenueOrders.reservationTime,
				startTime: hpReserveVenueOrders.startTime,
				endTime: hpReserveVenueOrders.endTime,
				numberOfUsers: hpReserveVenueOrders.numberOfUsers,
				createTime: hpReserveVenueOrders.createTime,
				updateTime: hpReserveVenueOrders.updateTime,
			})
			.from(hpReserveVenueOrders)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: ReserveVenueOrderListItem[] = data.map((item) => ({
			id: item.id,
			orderNumber: item.id?.substring(0, 8) || "",
			venue: "",
			site: item.timeSlot || "",
			reserver: item.booker || "",
			reservationPhone: item.contactPhone || "",
			reservationDate: item.reservationTime ? formatDateTime(item.reservationTime).split(" ")[0] : "",
			reservationTime: item.timeSlot || "",
			receivableAmount: "",
			receivedAmount: "",
			paymentMethod: "",
			status: item.status || "",
			createTime: formatDateTime(item.createTime),
			remark: item.remark || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<ReserveVenueOrderListItem>> = {
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
		console.error("[Reserve Venue Order List] Error:", error);
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
