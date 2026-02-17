/**
 * @file 合同打印列表接口
 * @description Print list API
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { ctPrints, ctContracts, ctFirstParties, ctSecondParties } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 打印查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
	contractName: z.string().optional(),
	contractNumber: z.string().optional(),
	contractType: z.string().optional(),
	printStatus: z.string().optional(),
});

/**
 * 合同打印列表 POST API
 * Print list POST API
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
			printStatus: body.printStatus === "" ? undefined : body.printStatus,
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

		// printStatus 在数据库中没有对应字段，使用固定状态

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 - 使用子查询关联 */
		const countSubQuery = db
			.select({
				printId: ctPrints.id,
			})
			.from(ctPrints)
			.leftJoin(ctContracts, eq(ctPrints.contractId, ctContracts.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.as("count_sub");

		const [countResult] = await db.select({ total: sql<number>`count(*)` }).from(countSubQuery);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ctPrints.id,
				contractName: ctContracts.contractName,
				contractNumber: ctContracts.contractNumber,
				contractType: ctContracts.contractType,
				partyA: ctFirstParties.name,
				partyB: ctSecondParties.name,
				printCount: ctPrints.printCount,
				lastPrintTime: ctPrints.printTime,
				lastPrinter: ctPrints.printer,
				printStatus: sql<string>`'未打印'`, // 简化处理
				createTime: ctPrints.createTime,
				updateTime: ctPrints.updateTime,
			})
			.from(ctPrints)
			.leftJoin(ctContracts, eq(ctPrints.contractId, ctContracts.id))
			.leftJoin(ctFirstParties, eq(ctContracts.firstPartyId, ctFirstParties.id))
			.leftJoin(ctSecondParties, eq(ctContracts.secondPartyId, ctSecondParties.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(ctPrints.createTime))
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
			printCount: item.printCount || 0,
			lastPrintTime: item.lastPrintTime || "",
			lastPrinter: item.lastPrinter || "",
			printStatus: item.printStatus || "",
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
		console.error("[Print List] Error:", error);
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
