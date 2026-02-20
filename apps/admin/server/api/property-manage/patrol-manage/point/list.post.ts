/**
 * @file Point 列表接口
 * @description Point list API
 * POST /api/property-manage/patrol-manage/point/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { ptPatrolPoints, ptPatrolPaths } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { PatrolPointListData, PointQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	pointName: z.string().optional(),
	pathId: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PatrolPointListData>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			pointName: body.name === "" ? undefined : body.name,
		};

		const query = querySchema.parse(rawQuery);

		const db = useDb(event);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.pointName) {
			conditions.push(like(ptPatrolPoints.pointName, `%${query.pointName}%`));
		}

		if (query.pathId) {
			conditions.push(eq(ptPatrolPoints.pathId, query.pathId));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: ptPatrolPoints.createTime,
			updateTime: ptPatrolPoints.updateTime,
			sortOrder: ptPatrolPoints.sortOrder,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(ptPatrolPoints)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 - 关联查询路线信息 */
		const data = await db
			.select({
				id: ptPatrolPoints.id,
				pathId: ptPatrolPoints.pathId,
				pointName: ptPatrolPoints.pointName,
				location: ptPatrolPoints.location,
				qrCodeOrNfc: ptPatrolPoints.qrCodeOrNfc,
				sortOrder: ptPatrolPoints.sortOrder,
				createTime: ptPatrolPoints.createTime,
				updateTime: ptPatrolPoints.updateTime,
			})
			.from(ptPatrolPoints)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: PatrolPointListData[] = data.map((item) => ({
			id: item.id || "",
			name: item.pointName || "",
			status: "enabled",
			remark: "",
			taskDetailId: "",
			patrolPointName: item.pointName || "",
			patrolPlanName: "",
			patrolRouteName: "",
			patrolPersonTime: "",
			patrolPointTime: "",
			actualPatrolTime: "",
			actualCheckInStatus: "",
			planPatrolPerson: "",
			actualPatrolPerson: "",
			patrolMethod: "",
			taskStatus: "",
			patrolPointStatus: "",
			patrolSituation: "",
			patrolPhotos: "",
			locationInfo: item.location || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<PatrolPointListData>> = {
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
		console.error("[PatrolPoint List] Error:", error);
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
