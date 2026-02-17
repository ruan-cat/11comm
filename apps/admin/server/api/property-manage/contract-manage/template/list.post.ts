/**
 * @file 合同模板列表接口
 * @description Template list API
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { ctTemplates } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 模板查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
	templateName: z.string().optional(),
	templateNumber: z.string().optional(),
	applicableContractType: z.string().optional(),
	status: z.string().optional(),
});

/**
 * 合同模板列表 POST API
 * Template list POST API
 */
export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			templateName: body.templateName === "" ? undefined : body.templateName,
			templateNumber: body.templateNumber === "" ? undefined : body.templateNumber,
			applicableContractType: body.applicableContractType === "" ? undefined : body.applicableContractType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.templateName) {
			conditions.push(like(ctTemplates.templateName, `%${query.templateName}%`));
		}

		if (query.templateNumber) {
			// 使用 version 字段作为模板编号的模拟
			conditions.push(like(ctTemplates.version, `%${query.templateNumber}%`));
		}

		if (query.applicableContractType) {
			conditions.push(eq(ctTemplates.templateType, query.applicableContractType));
		}

		if (query.status) {
			// ctTemplates.status 是 enum 类型 ("draft" | "published" | "disabled")
			// 前端传入的 status 可能是 "启用"/"禁用"，这里简化处理
		}

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(ctTemplates)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ctTemplates.id,
				templateName: ctTemplates.templateName,
				templateNumber: ctTemplates.version,
				applicableContractType: ctTemplates.templateType,
				templateVersion: ctTemplates.version,
				templateDescription: ctTemplates.templateContent,
				status: ctTemplates.status,
				createTime: ctTemplates.createTime,
				updateTime: ctTemplates.updateTime,
				creator: ctTemplates.createTime, // 简化处理
				usageCount: sql<number>`0`, // 简化处理，暂无使用次数字段
			})
			.from(ctTemplates)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(ctTemplates.createTime))
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			templateName: item.templateName || "",
			templateNumber: item.templateNumber || "",
			applicableContractType: item.applicableContractType || "",
			templateVersion: item.templateVersion || "",
			templateDescription: item.templateDescription || "",
			status: item.status || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			creator: item.creator || "",
			usageCount: item.usageCount || 0,
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

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
		console.error("[Template List] Error:", error);
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
