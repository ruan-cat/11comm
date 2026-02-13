/**
 * @file Draft Contract 列表接口
 * @description Draft Contract list API
 * POST /api/property-manage/contract-manage/draft-contract/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { ctContracts, ctFirstParties, ctSecondParties } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	contractName: z.string().optional(),
	contractNumber: z.string().optional(),
	contractType: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt", "startTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			contractName: body.contractName === "" ? undefined : body.contractName,
			contractNumber: body.contractNumber === "" ? undefined : body.contractNumber,
			contractType: body.contractType === "" ? undefined : body.contractType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建排序条件 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		/** 构建查询条件 */
		const conditions = [eq(ctContracts.status, "draft" as any)];

		if (query.contractName) {
			conditions.push(like(ctContracts.contractName, `%${query.contractName}%`));
		}

		if (query.contractNumber) {
			conditions.push(like(ctContracts.contractNumber, `%${query.contractNumber}%`));
		}

		if (query.contractType) {
			conditions.push(eq(ctContracts.contractType, query.contractType));
		}

		if (query.status) {
			conditions.push(eq(ctContracts.status, query.status as any));
		}

		/** 构建排序 */
		const sortFields: Record<string, any> = {
			createdAt: ctContracts.createdAt,
			updatedAt: ctContracts.updatedAt,
			startTime: ctContracts.startTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(ctContracts)
			.where(and(...conditions));

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ctContracts.id,
				contractName: ctContracts.contractName,
				contractNumber: ctContracts.contractNumber,
				contractType: ctContracts.contractType,
				amount: ctContracts.amount,
				startTime: ctContracts.startTime,
				endTime: ctContracts.endTime,
				status: ctContracts.status,
				remark: ctContracts.remark,
				createdAt: ctContracts.createdAt,
				updatedAt: ctContracts.updatedAt,
			})
			.from(ctContracts)
			.where(and(...conditions))
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			contractName: item.contractName || "",
			contractNumber: item.contractNumber || "",
			parentContractNumber: "",
			contractType: item.contractType || "",
			partyA: "",
			partyB: "",
			handler: "",
			contractAmount: item.amount || "",
			startTime: item.startTime ? new Date(item.startTime).toISOString().split("T")[0] : "",
			endTime: item.endTime ? new Date(item.endTime).toISOString().split("T")[0] : "",
			status: item.status || "draft",
			createTime: item.createdAt ? new Date(item.createdAt).toISOString() : "",
			updateTime: item.updatedAt ? new Date(item.updatedAt).toISOString() : "",
			remark: item.remark || "",
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
		console.error("[Draft Contract List] Error:", error);
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
