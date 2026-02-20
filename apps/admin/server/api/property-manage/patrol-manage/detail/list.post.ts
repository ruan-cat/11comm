/**
 * @file Detail 列表接口
 * @description Detail list API
 * POST /api/property-manage/patrol-manage/detail/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { ptPatrolTaskDetails, ptPatrolTasks, ptPatrolPoints, ptPatrolPlans, ptPatrolPaths } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { PatrolDetailListItem, PatrolDetailQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	taskStatus: z.string().optional(),
	patrolMethod: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PatrolDetailListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			taskStatus: body.taskStatus === "" ? undefined : body.taskStatus,
			patrolMethod: body.patrolMethod === "" ? undefined : body.patrolMethod,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.taskStatus) {
			conditions.push(eq(ptPatrolTasks.status, query.taskStatus as any));
		}

		if (query.patrolMethod) {
			conditions.push(eq(ptPatrolTasks.patrolMethod, query.patrolMethod));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: ptPatrolTaskDetails.createTime,
			updateTime: ptPatrolTaskDetails.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		const db = useDb(event);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(ptPatrolTaskDetails)
			.leftJoin(ptPatrolTasks, eq(ptPatrolTaskDetails.taskId, ptPatrolTasks.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 - 关联查询任务、计划、路线、点信息 */
		const data = await db
			.select({
				detailId: ptPatrolTaskDetails.id,
				taskId: ptPatrolTaskDetails.taskId,
				pointId: ptPatrolTaskDetails.pointId,
				checkInStatus: ptPatrolTaskDetails.checkInStatus,
				patrolSituation: ptPatrolTaskDetails.patrolSituation,
				patrolPhotoUrl: ptPatrolTaskDetails.patrolPhotoUrl,
				checkInTime: ptPatrolTaskDetails.checkInTime,
				gpsCoordinates: ptPatrolTaskDetails.gpsCoordinates,
				detailCreatedAt: ptPatrolTaskDetails.createTime,
				detailUpdatedAt: ptPatrolTaskDetails.updateTime,
				// 任务信息
				taskCode: ptPatrolTasks.taskCode,
				taskName: ptPatrolTasks.taskName,
				taskStatus: ptPatrolTasks.status,
				patrolMethod: ptPatrolTasks.patrolMethod,
				plannedStartTime: ptPatrolTasks.plannedStartTime,
				plannedEndTime: ptPatrolTasks.plannedEndTime,
				actualPatrolTime: ptPatrolTasks.actualPatrolTime,
				plannedPatroller: ptPatrolTasks.plannedPatroller,
				currentPatrolPerson: ptPatrolTasks.currentPatrolPerson,
			})
			.from(ptPatrolTaskDetails)
			.leftJoin(ptPatrolTasks, eq(ptPatrolTaskDetails.taskId, ptPatrolTasks.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: PatrolDetailListItem[] = data.map((item) => ({
			id: item.detailId || "",
			name: item.taskName || "",
			status: item.taskStatus || "pending",
			remark: "",
			taskDetailId: item.detailId || "",
			patrolPointName: "", // 需要关联查询巡检点名称
			patrolPlanName: "", // 需要关联查询计划名称
			patrolRouteName: "", // 需要关联查询路线名称
			patrolPersonStartEndTime:
				item.plannedStartTime && item.plannedEndTime ? `${item.plannedStartTime} ~ ${item.plannedEndTime}` : "",
			patrolPointStartEndTime: "",
			actualPatrolTime: item.actualPatrolTime ? formatDateTime(item.actualPatrolTime) : "",
			actualCheckInStatus: item.checkInStatus || "not_checked",
			plannedPatrolPerson: item.plannedPatroller || "",
			actualPatrolPerson: item.currentPatrolPerson || "",
			patrolMethod: item.patrolMethod || "",
			taskStatus: item.taskStatus || "pending",
			patrolPointStatus:
				item.checkInStatus === "checked" ? "normal" : item.checkInStatus === "abnormal" ? "abnormal" : "pending",
			patrolSituation: item.patrolSituation || "",
			patrolPhotos: item.patrolPhotoUrl || "",
			locationInfo: item.gpsCoordinates || "",
			createTime: item.detailCreatedAt ? formatDateTime(item.detailCreatedAt) : "",
			updateTime: item.detailUpdatedAt ? formatDateTime(item.detailUpdatedAt) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<PatrolDetailListItem>> = {
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
		console.error("[PatrolDetail List] Error:", error);
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
