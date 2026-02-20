/**
 * @file First Party 列表接口
 * @description First Party list API
 * POST /api/property-manage/contract-manage/first-party/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { ctFirstParties } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	name: z.string().optional(),
	contactPerson: z.string().optional(),
	contactPhone: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime", "name"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		const db = useDb(event);
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			name: body.name === "" ? undefined : body.name,
			contactPerson: body.contactPerson === "" ? undefined : body.contactPerson,
			contactPhone: body.contactPhone === "" ? undefined : body.contactPhone,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.name) {
			conditions.push(like(ctFirstParties.name, `%${query.name}%`));
		}

		if (query.contactPerson) {
			conditions.push(like(ctFirstParties.contactPerson, `%${query.contactPerson}%`));
		}

		if (query.contactPhone) {
			conditions.push(like(ctFirstParties.contactPhone, `%${query.contactPhone}%`));
		}

		if (query.status) {
			conditions.push(eq(ctFirstParties.status, query.status as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: ctFirstParties.createTime,
			updateTime: ctFirstParties.updateTime,
			name: ctFirstParties.name,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(ctFirstParties)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ctFirstParties.id,
				name: ctFirstParties.name,
				contactPerson: ctFirstParties.contactPerson,
				contactPhone: ctFirstParties.contactPhone,
				address: ctFirstParties.address,
				creditCode: ctFirstParties.creditCode,
				establishedDate: ctFirstParties.establishedDate,
				legalRepresentative: ctFirstParties.legalRepresentative,
				businessScope: ctFirstParties.businessScope,
				status: ctFirstParties.status,
				remark: ctFirstParties.remark,
				createTime: ctFirstParties.createTime,
				updateTime: ctFirstParties.updateTime,
			})
			.from(ctFirstParties)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			name: item.name || "",
			contactPerson: item.contactPerson || "",
			contactPhone: item.contactPhone || "",
			address: item.address || "",
			creditCode: item.creditCode || "",
			establishedDate: item.establishedDate || "",
			legalRepresentative: item.legalRepresentative || "",
			businessScope: item.businessScope || "",
			status: item.status || "enabled",
			remark: item.remark || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<any>> = {
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
		console.error("[First Party List] Error:", error);
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
