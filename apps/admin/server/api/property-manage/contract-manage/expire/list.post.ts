/**
 * @file Expire Contract 列表接口
 * @description Expire Contract list API
 * POST /api/property-manage/contract-manage/expire/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { ctContracts } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq, isNull, isNotNull } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	contractName: z.string().optional(),
	contractNumber: z.string().optional(),
	contractType: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime", "endTime"]).optional(),
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
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建排序条件 */
		const sortBy = query.sortBy || "endTime";
		const sortOrder = query.sortOrder || "asc";

		/** 构建查询条件 - 查询已过期合同和即将到期合同 */
		const conditions: any[] = [isNull(ctContracts.deletedAt), isNotNull(ctContracts.endTime)];

		if (query.contractName) {
			conditions.push(like(ctContracts.contractName, `%${query.contractName}%`));
		}

		if (query.contractNumber) {
			conditions.push(like(ctContracts.contractNumber, `%${query.contractNumber}%`));
		}

		if (query.contractType) {
			conditions.push(eq(ctContracts.contractType, query.contractType));
		}

		/** 构建排序 */
		const sortFields: Record<string, any> = {
			createTime: ctContracts.createTime,
			updateTime: ctContracts.updateTime,
			endTime: ctContracts.endTime,
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
				signDate: ctContracts.signDate,
				status: ctContracts.status,
				remark: ctContracts.remark,
				createTime: ctContracts.createTime,
				updateTime: ctContracts.updateTime,
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
			contractType: item.contractType || "",
			amount: item.amount || "",
			startTime: item.startTime ? formatDateTime(item.startTime)?.split(" ")[0] || "" : "",
			endTime: item.endTime ? formatDateTime(item.endTime)?.split(" ")[0] || "" : "",
			signDate: item.signDate || "",
			status: item.status || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
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
		console.error("[Expire Contract List] Error:", error);
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
