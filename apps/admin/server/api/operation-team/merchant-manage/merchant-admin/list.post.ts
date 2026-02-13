/**
 * @file merchant admin-列表接口
 * @description merchant admin list API
 * POST /api/operation-team/merchant-manage/merchant-admin/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { and, like, desc, eq, sql } from "drizzle-orm";
import { opMerchantAdmins, opMerchants } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";

/** 商户管理员列表查询参数 Schema */
const merchantAdminQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	merchantId: z.string().uuid().optional(),
	merchantName: z.string().optional(),
	adminName: z.string().optional(),
	phone: z.string().optional(),
	role: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event) => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
		};
		const query = merchantAdminQuerySchema.parse(rawQuery);

		// 2. 构建动态查询条件
		const conditions = [];

		// 精确匹配：商户ID
		if (query.merchantId) {
			conditions.push(eq(opMerchantAdmins.merchantId, query.merchantId));
		}

		// 模糊搜索：管理员姓名
		if (query.adminName) {
			conditions.push(like(opMerchantAdmins.adminName, `%${query.adminName}%`));
		}

		// 精确匹配：手机号
		if (query.phone) {
			conditions.push(eq(opMerchantAdmins.phone, query.phone));
		}

		// 精确匹配：角色
		if (query.role) {
			conditions.push(eq(opMerchantAdmins.role, query.role));
		}

		// 3. 计算分页偏移
		const page = query.page ?? 1;
		const pageSize = query.pageSize ?? 10;
		const offset = (page - 1) * pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select({
					id: opMerchantAdmins.id,
					merchantId: opMerchantAdmins.merchantId,
					adminName: opMerchantAdmins.adminName,
					phone: opMerchantAdmins.phone,
					email: opMerchantAdmins.email,
					account: opMerchantAdmins.account,
					role: opMerchantAdmins.role,
					createdAt: opMerchantAdmins.createdAt,
					updatedAt: opMerchantAdmins.updatedAt,
					merchantName: opMerchants.merchantName,
				})
				.from(opMerchantAdmins)
				.leftJoin(opMerchants, eq(opMerchantAdmins.merchantId, opMerchants.id))
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(opMerchantAdmins.createdAt))
				.limit(pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`cast(count(${opMerchantAdmins.id}) as int)` })
				.from(opMerchantAdmins)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		// 5. 返回标准分页结构
		const total = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(total / pageSize);

		/** [v2.0 更新] 必须使用 JsonVO<PageDTO<...>> 类型注解约束响应 */
		const response: JsonVO<PageDTO<(typeof data)[number]>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list: data,
				total,
				pageIndex: page,
				pageSize,
				totalPages,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[Merchant Admin List] Error:", error);

		/** [v2.0 更新] 必须使用 JsonVO<null> 类型注解约束错误响应 */
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
