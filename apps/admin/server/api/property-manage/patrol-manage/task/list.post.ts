/**
 * @file Task 列表接口
 * @description Task list API
 * POST /api/property-manage/patrol-manage/task/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { ptPatrolTasks, ptPatrolPlans } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { PatrolTaskListItem, PatrolTaskQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	taskCode: z.string().optional(),
	taskName: z.string().optional(),
	status: z.string().optional(),
	patrolMethod: z.string().optional(),
	currentPatrolPerson: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime", "plannedStartTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PatrolTaskListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			taskCode: body.taskCode === "" ? undefined : body.taskCode,
			taskName: body.taskName === "" ? undefined : body.taskName,
			status: body.patrolStatus === "" ? undefined : body.patrolStatus,
			currentPatrolPerson: body.executor === "" ? undefined : body.executor,
		};

		const query = querySchema.parse(rawQuery);

		const db = useDb(event);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.taskCode) {
			conditions.push(like(ptPatrolTasks.taskCode, `%${query.taskCode}%`));
		}

		if (query.taskName) {
			conditions.push(like(ptPatrolTasks.taskName, `%${query.taskName}%`));
		}

		if (query.status) {
			conditions.push(eq(ptPatrolTasks.status, query.status as any));
		}

		if (query.patrolMethod) {
			conditions.push(eq(ptPatrolTasks.patrolMethod, query.patrolMethod));
		}

		if (query.currentPatrolPerson) {
			conditions.push(like(ptPatrolTasks.currentPatrolPerson, `%${query.currentPatrolPerson}%`));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: ptPatrolTasks.createTime,
			updateTime: ptPatrolTasks.updateTime,
			plannedStartTime: ptPatrolTasks.plannedStartTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(ptPatrolTasks)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 - 关联查询计划信息 */
		const data = await db
			.select({
				id: ptPatrolTasks.id,
				planId: ptPatrolTasks.planId,
				taskCode: ptPatrolTasks.taskCode,
				taskName: ptPatrolTasks.taskName,
				plannedPatroller: ptPatrolTasks.plannedPatroller,
				plannedPatrollerId: ptPatrolTasks.plannedPatrollerId,
				patrolMethod: ptPatrolTasks.patrolMethod,
				plannedStartTime: ptPatrolTasks.plannedStartTime,
				plannedEndTime: ptPatrolTasks.plannedEndTime,
				actualPatrolTime: ptPatrolTasks.actualPatrolTime,
				status: ptPatrolTasks.status,
				currentPatrolPerson: ptPatrolTasks.currentPatrolPerson,
				currentPatrolPersonId: ptPatrolTasks.currentPatrolPersonId,
				transferDescription: ptPatrolTasks.transferDescription,
				createTime: ptPatrolTasks.createTime,
				updateTime: ptPatrolTasks.updateTime,
			})
			.from(ptPatrolTasks)
			.leftJoin(ptPatrolPlans, eq(ptPatrolTasks.planId, ptPatrolPlans.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: PatrolTaskListItem[] = data.map((item) => ({
			id: item.id || "",
			name: item.taskName || "",
			status: item.status || "pending",
			remark: item.transferDescription || "",
			taskCode: item.taskCode || "",
			patrolPlan: item.planId ? "巡检计划" : "",
			patrolPersonTimeRange:
				item.plannedStartTime && item.plannedEndTime ? `${item.plannedStartTime} ~ ${item.plannedEndTime}` : "",
			actualPatrolTime: item.actualPatrolTime ? formatDateTime(item.actualPatrolTime) : "",
			plannedPatrolPerson: item.plannedPatroller || "",
			currentPatrolPerson: item.currentPatrolPerson || "",
			transferDescription: item.transferDescription || "",
			patrolMethod: item.patrolMethod || "",
			patrolStatus: item.status || "pending",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<PatrolTaskListItem>> = {
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
		console.error("[PatrolTask List] Error:", error);
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
