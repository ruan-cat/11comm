/**
 * @file Cancel Fee 列表接口
 * @description Cancel Fee list API
 * POST /api/property-manage/expense-manage/cancel-fee/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { exCancelFees } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	/** 费用ID Charge ID */
	chargeId: z.string().optional(),
	/** 费用类型 Charge Type */
	chargeType: z.string().optional(),
	/** 员工 Employee */
	employee: z.string().optional(),
	/** 时间 Time */
	time: z.string().optional(),
	/** 取消原因 Cancel Reason */
	cancelReason: z.string().optional(),
	/** 审核状态 Audit Status */
	auditStatus: z.string().optional(),
	/** 当前页码 Current page (1-based) */
	page: z.coerce.number().min(1).default(1),
	/** 每页大小 Page size */
	pageSize: z.coerce.number().min(1).max(100).default(10),
});

export default defineHandler(async (event) => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const query = querySchema.parse({
			...body,
			page: body.page || body.pageIndex || 1,
		});

		// 2. 构建动态查询条件
		const conditions = [];

		// 模糊搜索：费用ID
		if (query.chargeId) {
			conditions.push(like(exCancelFees.chargeId, `%${query.chargeId}%`));
		}

		// 模糊搜索：费用类型
		if (query.chargeType) {
			conditions.push(like(exCancelFees.chargeType, `%${query.chargeType}%`));
		}

		// 模糊搜索：取消原因
		if (query.cancelReason) {
			conditions.push(like(exCancelFees.cancelReason, `%${query.cancelReason}%`));
		}

		// 模糊搜索：操作人（对应 employee 字段）
		if (query.employee) {
			conditions.push(like(exCancelFees.operator, `%${query.employee}%`));
		}

		// 精确匹配：审核状态
		if (query.auditStatus) {
			conditions.push(eq(exCancelFees.auditStatus, query.auditStatus as "pending" | "approved" | "rejected"));
		}

		// 3. 计算分页偏移
		const offset = (query.page - 1) * query.pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select()
				.from(exCancelFees)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(exCancelFees.createTime))
				.limit(query.pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`cast(count(${exCancelFees.id}) as int)` })
				.from(exCancelFees)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		// 5. 转换数据格式
		const list = data.map((item) => ({
			id: item.id,
			chargeId: item.chargeId || "",
			chargeType: item.chargeType || "",
			operator: item.operator || "",
			cancelReason: item.cancelReason || "",
			auditStatus: item.auditStatus || "pending",
			remark: item.remark || "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
		}));

		// 6. 返回标准分页结构
		const total = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(total / query.pageSize);

		/** 必须使用 JsonVO<PageDTO<...>> 类型注解约束响应 */
		const response: JsonVO<PageDTO<(typeof list)[number]>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list,
				total,
				pageIndex: query.page,
				pageSize: query.pageSize,
				totalPages,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[CancelFee List] Error:", error);

		/** 必须使用 JsonVO<null> 类型注解约束错误响应 */
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
