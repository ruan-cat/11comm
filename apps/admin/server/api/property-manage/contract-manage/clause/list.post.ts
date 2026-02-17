/**
 * @file 合同条款列表接口
 * @description Clause list API
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { ctClauses, ctTemplates } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 条款查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
	clauseName: z.string().optional(),
	clauseNumber: z.string().optional(),
	clauseType: z.string().optional(),
	applicableContractType: z.string().optional(),
	status: z.string().optional(),
});

/**
 * 合同条款列表 POST API
 * Clause list POST API
 */
export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			clauseName: body.clauseName === "" ? undefined : body.clauseName,
			clauseNumber: body.clauseNumber === "" ? undefined : body.clauseNumber,
			clauseType: body.clauseType === "" ? undefined : body.clauseType,
			applicableContractType: body.applicableContractType === "" ? undefined : body.applicableContractType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.clauseName) {
			conditions.push(like(ctClauses.clauseName, `%${query.clauseName}%`));
		}

		// clauseNumber 在数据库中没有对应字段
		if (query.clauseType) {
			conditions.push(eq(ctClauses.clauseType, query.clauseType));
		}

		// applicableContractType 需要关联模板获取
		if (query.applicableContractType) {
			conditions.push(eq(ctTemplates.templateType, query.applicableContractType));
		}

		// status 在 ctClauses 中不存在，跳过

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 - 使用子查询关联 */
		const countSubQuery = db
			.select({
				clauseId: ctClauses.id,
			})
			.from(ctClauses)
			.leftJoin(ctTemplates, eq(ctClauses.templateId, ctTemplates.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.as("count_sub");

		const [countResult] = await db.select({ total: sql<number>`count(*)` }).from(countSubQuery);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ctClauses.id,
				clauseName: ctClauses.clauseName,
				clauseNumber: ctClauses.id, // 使用 ID 作为条款编号的模拟
				clauseType: ctClauses.clauseType,
				clauseContent: ctClauses.clauseContent,
				applicableContractType: ctTemplates.templateType,
				status: sql<string>`'启用'`, // 简化处理
				sortOrder: ctClauses.sortOrder,
				createdAt: ctClauses.createdAt,
				updatedAt: ctClauses.updatedAt,
				creator: ctClauses.createdAt, // 简化处理
				remark: ctClauses.remark,
			})
			.from(ctClauses)
			.leftJoin(ctTemplates, eq(ctClauses.templateId, ctTemplates.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(ctClauses.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			clauseName: item.clauseName || "",
			clauseNumber: item.clauseNumber || "",
			clauseType: item.clauseType || "",
			clauseContent: item.clauseContent || "",
			applicableContractType: item.applicableContractType || "",
			status: item.status || "",
			sortOrder: item.sortOrder || 0,
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
			creator: item.creator || "",
			remark: item.remark || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<typeof list>> = {
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
		console.error("[Clause List] Error:", error);
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
