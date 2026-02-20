/**
 * @file 合同乙方列表接口
 * @description Second party list API
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { ctSecondParties } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 乙方查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
	partyB: z.string().optional(),
	contactPerson: z.string().optional(),
	contactPhone: z.string().optional(),
	legalRepresentative: z.string().optional(),
	status: z.string().optional(),
});

/**
 * 合同乙方列表 POST API
 * Second party list POST API
 */
export default defineHandler(async (event) => {
	try {
		const db = useDb(event);
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			partyB: body.partyB === "" ? undefined : body.partyB,
			contactPerson: body.contactPerson === "" ? undefined : body.contactPerson,
			contactPhone: body.contactPhone === "" ? undefined : body.contactPhone,
			legalRepresentative: body.legalRepresentative === "" ? undefined : body.legalRepresentative,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.partyB) {
			conditions.push(like(ctSecondParties.name, `%${query.partyB}%`));
		}

		if (query.contactPerson) {
			conditions.push(like(ctSecondParties.contactPerson, `%${query.contactPerson}%`));
		}

		if (query.contactPhone) {
			conditions.push(like(ctSecondParties.contactPhone, `%${query.contactPhone}%`));
		}

		if (query.legalRepresentative) {
			// ctSecondParties 表中没有 legalRepresentative 字段，跳过
		}

		if (query.status) {
			// ctSecondParties 表中没有 status 字段，跳过
		}

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(ctSecondParties)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ctSecondParties.id,
				partyB: ctSecondParties.name,
				contactPerson: ctSecondParties.contactPerson,
				contactPhone: ctSecondParties.contactPhone,
				address: ctSecondParties.address,
				creditCode: sql<string>`null`, // 简化处理
				establishmentDate: sql<string>`null`, // 简化处理
				legalRepresentative: sql<string>`null`, // ctSecondParties 表中没有此字段
				businessScope: sql<string>`null`, // ctSecondParties 表中没有此字段
				status: sql<string>`'启用'`, // ctSecondParties 表中没有此字段
				createTime: ctSecondParties.createTime,
				updateTime: ctSecondParties.updateTime,
				remark: ctSecondParties.remark,
			})
			.from(ctSecondParties)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(ctSecondParties.createTime))
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			partyB: item.partyB || "",
			contactPerson: item.contactPerson || "",
			contactPhone: item.contactPhone || "",
			address: item.address || "",
			creditCode: item.creditCode || "",
			establishmentDate: item.establishmentDate || "",
			legalRepresentative: item.legalRepresentative || "",
			businessScope: item.businessScope || "",
			status: item.status || "",
			remark: item.remark || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
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
		console.error("[Second Party List] Error:", error);
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
