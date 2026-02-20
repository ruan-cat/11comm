/**
 * @file Plan 列表接口
 * @description Plan list API
 * POST /api/property-manage/patrol-manage/plan/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { ptPatrolPlans } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { PatrolPlanListItem, PatrolPlanQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	planName: z.string().optional(),
	patrolType: z.string().optional(),
	patrolPerson: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PatrolPlanListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			planName: body.planName === "" ? undefined : body.planName,
		};

		const query = querySchema.parse(rawQuery);

		const db = useDb(event);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.planName) {
			conditions.push(like(ptPatrolPlans.planName, `%${query.planName}%`));
		}

		if (query.patrolType) {
			conditions.push(eq(ptPatrolPlans.patrolType, query.patrolType));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: ptPatrolPlans.createTime,
			updateTime: ptPatrolPlans.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(ptPatrolPlans)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ptPatrolPlans.id,
				communityId: ptPatrolPlans.communityId,
				planName: ptPatrolPlans.planName,
				patrolType: ptPatrolPlans.patrolType,
				patrolLevel: ptPatrolPlans.patrolLevel,
				planDescription: ptPatrolPlans.planDescription,
				frequency: ptPatrolPlans.frequency,
				startDate: ptPatrolPlans.startDate,
				endDate: ptPatrolPlans.endDate,
				executionTimeSlot: ptPatrolPlans.executionTimeSlot,
				remark: ptPatrolPlans.remark,
				createTime: ptPatrolPlans.createTime,
				updateTime: ptPatrolPlans.updateTime,
			})
			.from(ptPatrolPlans)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: PatrolPlanListItem[] = data.map((item) => ({
			id: item.id || "",
			name: item.planName || "",
			status: "enabled",
			remark: item.remark || "",
			planName: item.planName || "",
			planRoute: "",
			planCycle: item.frequency || "",
			checkInMethod: "二维码",
			dateRange: item.startDate && item.endDate ? `${item.startDate} ~ ${item.endDate}` : "",
			timeRange: item.executionTimeSlot || "",
			taskAdvanceMinutes: "30",
			planner: "",
			planTime: item.createTime ? formatDateTime(item.createTime) : "",
			patrolStaff: "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<PatrolPlanListItem>> = {
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
		console.error("[PatrolPlan List] Error:", error);
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
