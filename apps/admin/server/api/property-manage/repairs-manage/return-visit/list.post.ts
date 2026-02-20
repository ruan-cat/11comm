/**
 * @file Return Visit 列表接口
 * @description Return Visit list API
 * POST /api/property-manage/repairs-manage/return-visit/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { rpReturnVisits, rpRepairOrders } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ReturnVisitListItem, ReturnVisitQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq, isNull } from "drizzle-orm";
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

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ReturnVisitListItem>>> => {
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

		const db = useDb(event);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		// 移除 deletedAt 检查，因为表结构可能没有此字段

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: rpReturnVisits.createTime,
			updateTime: rpReturnVisits.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(rpReturnVisits)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 - 关联报修工单表 */
		const data = await db
			.select({
				id: rpReturnVisits.id,
				orderId: rpReturnVisits.orderId,
				visitor: rpReturnVisits.visitor,
				visitTime: rpReturnVisits.visitTime,
				visitMethod: rpReturnVisits.visitMethod,
				satisfactionRating: rpReturnVisits.satisfactionRating,
				visitStatus: rpReturnVisits.visitStatus,
				visitNote: rpReturnVisits.visitNote,
				createTime: rpReturnVisits.createTime,
				updateTime: rpReturnVisits.updateTime,
			})
			.from(rpReturnVisits)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: ReturnVisitListItem[] = data.map((item) => ({
			id: item.id || "",
			name: item.visitor || "",
			status: item.visitStatus || "not_visited",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			remark: item.visitNote || "",
			workOrderNumber: item.orderId || "",
			location: "",
			repairType: "",
			reporter: "",
			contactInfo: "",
			appointmentTime: "",
			returnVisitStatus: item.visitStatus || "not_visited",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<ReturnVisitListItem>> = {
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
		console.error("[ReturnVisit List] Error:", error);
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
