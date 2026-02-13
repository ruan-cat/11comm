/**
 * @file 系统管理-修改密码-密码修改记录列表接口
 * @description Change password record list API
 * POST /api/setting-manage/system-manage/change-password/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { smChangePasswordRecords } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, sql } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	username: z.string().optional(),
	realName: z.string().optional(),
	department: z.string().optional(),
	changeType: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event) => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			username: body.username === "" ? undefined : body.username,
			realName: body.realName === "" ? undefined : body.realName,
			department: body.department === "" ? undefined : body.department,
			changeType: body.changeType === "" ? undefined : body.changeType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		// 模糊搜索用户名
		if (query.username) {
			conditions.push(like(smChangePasswordRecords.username, `%${query.username}%`));
		}

		// 模糊搜索真实姓名
		if (query.realName) {
			conditions.push(like(smChangePasswordRecords.realName, `%${query.realName}%`));
		}

		// 匹配部门
		if (query.department) {
			conditions.push(like(smChangePasswordRecords.department, `%${query.department}%`));
		}

		// 匹配修改类型
		if (query.changeType) {
			conditions.push(like(smChangePasswordRecords.changeType, `%${query.changeType}%`));
		}

		// 匹配状态
		if (query.status) {
			conditions.push(like(smChangePasswordRecords.status, `%${query.status}%`));
		}

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(smChangePasswordRecords)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: smChangePasswordRecords.id,
				username: smChangePasswordRecords.username,
				realName: smChangePasswordRecords.realName,
				department: smChangePasswordRecords.department,
				changeTime: smChangePasswordRecords.changeTime,
				changeIp: smChangePasswordRecords.changeIp,
				changeType: smChangePasswordRecords.changeType,
				operator: smChangePasswordRecords.operator,
				status: smChangePasswordRecords.status,
				remark: smChangePasswordRecords.remark,
				createdAt: smChangePasswordRecords.createdAt,
				updatedAt: smChangePasswordRecords.updatedAt,
			})
			.from(smChangePasswordRecords)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(smChangePasswordRecords.createdAt))
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
				pageIndex: query.page,
				totalPages,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[Change Password Record List] Error:", error);
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
