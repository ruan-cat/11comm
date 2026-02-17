/**
 * @file 合同审核列表接口
 * @description Review list API
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { ctReviews, ctContracts, ctFirstParties, ctSecondParties } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 审核查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
	contractName: z.string().optional(),
	contractNumber: z.string().optional(),
	contractType: z.string().optional(),
	reviewStatus: z.string().optional(),
	submitter: z.string().optional(),
});

/**
 * 合同审核列表 POST API
 * Review list POST API
 */
export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			contractName: body.contractName === "" ? undefined : body.contractName,
			contractNumber: body.contractNumber === "" ? undefined : body.contractNumber,
			contractType: body.contractType === "" ? undefined : body.contractType,
			reviewStatus: body.reviewStatus === "" ? undefined : body.reviewStatus,
			submitter: body.submitter === "" ? undefined : body.submitter,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.contractName) {
			conditions.push(like(ctContracts.contractName, `%${query.contractName}%`));
		}

		if (query.contractNumber) {
			conditions.push(like(ctContracts.contractNumber, `%${query.contractNumber}%`));
		}

		if (query.contractType) {
			conditions.push(eq(ctContracts.contractType, query.contractType));
		}

		if (query.reviewStatus) {
			// ctReviews.reviewResult 是 enum 类型 ("pending" | "approved" | "rejected")
			// 前端传入的 reviewStatus 可能是 "待审核"/"已通过"等，这里简化处理
		}

		// submitter 字段在 ctReviews 中不存在，跳过

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 - 使用子查询关联 */
		const countSubQuery = db
			.select({
				reviewId: ctReviews.id,
			})
			.from(ctReviews)
			.leftJoin(ctContracts, eq(ctReviews.contractId, ctContracts.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.as("count_sub");

		const [countResult] = await db.select({ total: sql<number>`count(*)` }).from(countSubQuery);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ctReviews.id,
				contractName: ctContracts.contractName,
				contractNumber: ctContracts.contractNumber,
				contractType: ctContracts.contractType,
				partyA: ctFirstParties.name,
				partyB: ctSecondParties.name,
				contractAmount: ctContracts.amount,
				submitter: ctContracts.createdAt, // 简化处理
				submitTime: ctContracts.createdAt,
				reviewer: ctReviews.reviewer,
				reviewTime: ctReviews.reviewTime,
				reviewStatus: ctReviews.reviewResult,
				reviewOpinion: ctReviews.reviewOpinion,
				currentNode: sql<string>`'审核中'`, // 简化处理
				createdAt: ctReviews.createdAt,
				updatedAt: ctReviews.updatedAt,
			})
			.from(ctReviews)
			.leftJoin(ctContracts, eq(ctReviews.contractId, ctContracts.id))
			.leftJoin(ctFirstParties, eq(ctContracts.firstPartyId, ctFirstParties.id))
			.leftJoin(ctSecondParties, eq(ctContracts.secondPartyId, ctSecondParties.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(ctReviews.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			contractName: item.contractName || "",
			contractNumber: item.contractNumber || "",
			contractType: item.contractType || "",
			partyA: item.partyA || "",
			partyB: item.partyB || "",
			contractAmount: item.contractAmount || "",
			submitter: item.submitter || "",
			submitTime: item.submitTime || "",
			reviewer: item.reviewer || "",
			reviewTime: item.reviewTime || "",
			reviewStatus: item.reviewStatus || "",
			reviewOpinion: item.reviewOpinion || "",
			currentNode: item.currentNode || "",
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
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
		console.error("[Review List] Error:", error);
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
