/**
 * @file Owner Account 列表接口
 * @description Owner Account list API
 * POST /api/property-manage/house-property-manage/owner-account/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { hpOwnerAccounts, hpOwners } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { OwnerAccountListItem, OwnerAccountQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	accountName: z.string().optional(),
	idCard: z.string().optional(),
	phone: z.string().optional(),
	accountType: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OwnerAccountListItem>>> => {
	try {
		const db = useDb(event);
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			accountName: body.accountName === "" ? undefined : body.accountName,
			idCard: body.idCard === "" ? undefined : body.idCard,
			phone: body.phone === "" ? undefined : body.phone,
			accountType: body.accountType === "" ? undefined : body.accountType,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.accountName) {
			conditions.push(like(hpOwnerAccounts.accountName, `%${query.accountName}%`));
		}

		if (query.accountType) {
			conditions.push(eq(hpOwnerAccounts.accountType, query.accountType as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: hpOwnerAccounts.createTime,
			updateTime: hpOwnerAccounts.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(hpOwnerAccounts)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 - 关联业主表获取更多信息 */
		const data = await db
			.select({
				id: hpOwnerAccounts.id,
				ownerId: hpOwnerAccounts.ownerId,
				accountNo: hpOwnerAccounts.accountNo,
				accountName: hpOwnerAccounts.accountName,
				accountType: hpOwnerAccounts.accountType,
				balance: hpOwnerAccounts.balance,
				deductionHouse: hpOwnerAccounts.deductionHouse,
				remark: hpOwnerAccounts.remark,
				createTime: hpOwnerAccounts.createTime,
				updateTime: hpOwnerAccounts.updateTime,
			})
			.from(hpOwnerAccounts)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: OwnerAccountListItem[] = data.map((item) => ({
			accountNo: item.accountNo || "",
			accountName: item.accountName || "",
			idCard: "", // 需要关联查询
			phone: "", // 需要关联查询
			accountType: item.accountType || "",
			accountBalance: item.balance?.toString() || "0",
			deductHouseNo: item.deductionHouse || "",
			createTime: formatDateTime(item.createTime),
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			remark: item.remark || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<OwnerAccountListItem>> = {
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
		console.error("[Owner Account List] Error:", error);
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
