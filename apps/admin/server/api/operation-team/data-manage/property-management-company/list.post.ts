/**
 * @file property management company-列表接口
 * @description property management company list API
 * POST /api/operation-team/data-manage/property-management-company/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { opPropertyCompanies } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, sql } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	companyId: z.string().optional(),
	companyName: z.string().optional(),
	phone: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			companyName: body.companyName === "" ? undefined : body.companyName,
			companyId: body.companyId === "" ? undefined : body.companyId,
			phone: body.phone === "" ? undefined : body.phone,
		};
		const query = querySchema.parse(rawQuery);

		// 2. 构建查询条件
		const conditions = [];

		if (query.companyName) {
			conditions.push(like(opPropertyCompanies.companyName, `%${query.companyName}%`));
		}

		if (query.companyId) {
			conditions.push(like(opPropertyCompanies.companyCode, `%${query.companyId}%`));
		}

		if (query.phone) {
			conditions.push(like(opPropertyCompanies.contactPhone, `%${query.phone}%`));
		}

		// 3. 计算分页偏移
		const offset = (query.page - 1) * query.pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select({
					id: opPropertyCompanies.id,
					companyId: opPropertyCompanies.companyCode,
					companyName: opPropertyCompanies.companyName,
					address: opPropertyCompanies.address,
					administrator: opPropertyCompanies.contactPerson,
					phone: opPropertyCompanies.contactPhone,
					contactPerson: opPropertyCompanies.contactPerson,
					contactPhone: opPropertyCompanies.contactPhone,
					qualificationLevel: opPropertyCompanies.qualificationLevel,
					remark: opPropertyCompanies.remark,
					createTime: opPropertyCompanies.createTime,
					updateTime: opPropertyCompanies.updateTime,
				})
				.from(opPropertyCompanies)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(opPropertyCompanies.createTime))
				.limit(query.pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`count(*)` })
				.from(opPropertyCompanies)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		// 5. 计算总页数
		const total = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(total / query.pageSize);

		// 6. 转换数据格式以匹配前端期望
		const list = data.map((item) => ({
			companyId: item.companyId || "",
			companyName: item.companyName || "",
			address: item.address || "",
			administrator: item.administrator || "",
			phone: item.phone || "",
			contactPerson: item.contactPerson || "",
			contactPhone: item.contactPhone || "",
			legalRepresentative: "",
			establishmentDate: "",
			landmark: "",
			createTime: item.createTime ? new Date(item.createTime).toLocaleString("zh-CN") : "",
			communityCount: 0,
			companyType: "private",
			serviceLevel: "level_1",
			operationStatus: "operating",
			remarks: item.remark || "",
			qualificationLevel: item.qualificationLevel || "",
		}));

		/** 返回标准格式 */
		const response: JsonVO<PageDTO<any>> = {
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
		console.error("[Property Management Company List] Error:", error);

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
