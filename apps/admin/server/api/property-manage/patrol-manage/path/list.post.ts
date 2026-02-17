/**
 * @file Path 列表接口
 * @description Path list API
 * POST /api/property-manage/patrol-manage/path/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { ptPatrolPaths } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { PatrolPathListItem, PatrolPathQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	pathName: z.string().optional(),
	planId: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PatrolPathListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			pathName: body.patrolPathName === "" ? undefined : body.patrolPathName,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.pathName) {
			conditions.push(like(ptPatrolPaths.pathName, `%${query.pathName}%`));
		}

		if (query.planId) {
			conditions.push(eq(ptPatrolPaths.planId, query.planId));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: ptPatrolPaths.createTime,
			updateTime: ptPatrolPaths.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(ptPatrolPaths)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ptPatrolPaths.id,
				planId: ptPatrolPaths.planId,
				pathName: ptPatrolPaths.pathName,
				pathDescription: ptPatrolPaths.pathDescription,
				estimatedDuration: ptPatrolPaths.estimatedDuration,
				createTime: ptPatrolPaths.createTime,
				updateTime: ptPatrolPaths.updateTime,
			})
			.from(ptPatrolPaths)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: PatrolPathListItem[] = data.map((item) => ({
			id: item.id || "",
			name: item.pathName || "",
			status: "enabled",
			remark: "",
			patrolPointId: item.id || "",
			patrolPointName: item.pathName || "",
			patrolPointType: "",
			patrolLocation: item.pathDescription || "",
			startTime: "",
			endTime: "",
			sortOrder: item.estimatedDuration?.toString() || "0",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<PatrolPathListItem>> = {
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
		console.error("[PatrolPath List] Error:", error);
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
