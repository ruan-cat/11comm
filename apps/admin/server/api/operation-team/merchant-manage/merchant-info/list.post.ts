/**
 * @file merchant info-列表接口
 * @description merchant info list API
 * POST /api/operation-team/merchant-manage/merchant-info/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { and, like, desc, eq, sql } from "drizzle-orm";
import { opMerchants, selectOpMerchantListQuerySchema, selectOpMerchantSchema } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";

/** 商户信息列表查询参数 Schema */
const merchantInfoQuerySchema = selectOpMerchantListQuerySchema.extend({
	merchantName: z.string().optional(),
	merchantCode: z.string().optional(),
	contactPerson: z.string().optional(),
	contactPhone: z.string().optional(),
	status: z.enum(["enabled", "disabled"]).optional(),
});

export default defineHandler(async (event) => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
		};
		const query = merchantInfoQuerySchema.parse(rawQuery);

		// 2. 构建动态查询条件
		const conditions = [];

		// 模糊搜索：商户名称
		if (query.merchantName) {
			conditions.push(like(opMerchants.merchantName, `%${query.merchantName}%`));
		}

		// 模糊搜索：商户编码
		if (query.merchantCode) {
			conditions.push(like(opMerchants.merchantCode, `%${query.merchantCode}%`));
		}

		// 模糊搜索：联系人
		if (query.contactPerson) {
			conditions.push(like(opMerchants.contactPerson, `%${query.contactPerson}%`));
		}

		// 精确匹配：联系电话
		if (query.contactPhone) {
			conditions.push(eq(opMerchants.contactPhone, query.contactPhone));
		}

		// 精确匹配：状态
		if (query.status) {
			conditions.push(eq(opMerchants.status, query.status));
		}

		// 3. 计算分页偏移
		const pageIndex = query.pageIndex ?? 1;
		const pageSize = query.pageSize ?? 10;
		const offset = (pageIndex - 1) * pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select()
				.from(opMerchants)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(opMerchants.createdAt))
				.limit(pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`cast(count(${opMerchants.id}) as int)` })
				.from(opMerchants)
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
				pageIndex: pageIndex,
				pageSize,
				totalPages,
			},
		};
		return response;
	} catch (error: any) {
		console.error("[Merchant Info List] Error:", error);

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
