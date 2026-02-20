/**
 * @file 运营团队-修改密码记录-列表接口
 * @description Change password record list API
 * POST /api/operation-team/system-manage/change-password/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { smChangePasswordRecords } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql } from "drizzle-orm";
import type { ChangePasswordRecord } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	username: z.string().optional(),
	realName: z.string().optional(),
	department: z.string().optional(),
	changeTime: z.string().optional(),
	changeType: z.string().optional(),
	status: z.string().optional(),
	changeTimeRange: z.array(z.string()).optional(),
});

export default defineHandler(async (event) => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数：映射 pageIndex → page，空字符串清洗为 undefined */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			username: body.username === "" ? undefined : body.username,
			realName: body.realName === "" ? undefined : body.realName,
			department: body.department === "" ? undefined : body.department,
			changeTime: body.changeTime === "" ? undefined : body.changeTime,
			changeType: body.changeType === "" ? undefined : body.changeType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		const db = useDb(event);

		/** 构建查询条件 */
		const conditions = [];

		if (query.username) {
			conditions.push(like(smChangePasswordRecords.username, `%${query.username}%`));
		}

		if (query.realName) {
			conditions.push(like(smChangePasswordRecords.realName, `%${query.realName}%`));
		}

		if (query.department) {
			conditions.push(like(smChangePasswordRecords.department, `%${query.department}%`));
		}

		if (query.changeType) {
			conditions.push(like(smChangePasswordRecords.changeType, `%${query.changeType}%`));
		}

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
				createTime: smChangePasswordRecords.createTime,
				updateTime: smChangePasswordRecords.updateTime,
			})
			.from(smChangePasswordRecords)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(smChangePasswordRecords.changeTime))
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		// 映射到前端类型 - 转换时间字段格式
		const list: ChangePasswordRecord[] = data.map((item) => ({
			id: item.id,
			username: item.username,
			realName: item.realName || "",
			department: item.department || "",
			changeTime: item.changeTime || "",
			changeIp: item.changeIp || "",
			changeType: item.changeType || "",
			operator: item.operator || "",
			status: item.status || "",
			remark: item.remark || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		/**
		 * 使用 JsonVO<PageDTO<...>> 类型注解约束成功响应
		 */
		const response: JsonVO<PageDTO<ChangePasswordRecord>> = {
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
		console.error("[Change Password Record List] Error:", error);

		/**
		 * 使用 JsonVO<null> 类型注解约束错误响应
		 * @description error 携带错误信息，stack 仅在开发环境暴露
		 */
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
