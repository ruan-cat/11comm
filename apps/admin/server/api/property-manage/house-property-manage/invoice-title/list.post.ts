/**
 * @file Invoice Title 列表接口
 * @description Invoice Title list API
 * POST /api/property-manage/house-property-manage/invoice-title/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { hpInvoiceTitles, hpOwners } from "@01s-11comm/type";
import { eq, like } from "drizzle-orm";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { InvoiceTitleListItem, InvoiceTitleQueryParams } from "@01s-11comm/type";
import { and, desc, asc, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	ownerName: z.string().optional(),
	invoiceType: z.string().optional(),
	invoiceTitle: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<InvoiceTitleListItem>>> => {
	try {
		const db = useDb(event);
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			ownerName: body.ownerName === "" ? undefined : body.ownerName,
			invoiceType: body.invoiceType === "" ? undefined : body.invoiceType,
			invoiceTitle: body.invoiceTitle === "" ? undefined : body.invoiceTitle,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 - 关联查询业主信息 */
		const conditions = [];

		// 关联 hpOwners 表来查询 ownerName
		if (query.ownerName) {
			conditions.push(like(hpOwners.name, `%${query.ownerName}%`));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: hpInvoiceTitles.createTime,
			updateTime: hpInvoiceTitles.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 - 关联查询 */
		let countResult;
		if (query.ownerName) {
			countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpInvoiceTitles)
				.innerJoin(hpOwners, eq(hpInvoiceTitles.ownerId, hpOwners.id))
				.where(conditions.length > 0 ? and(...conditions) : undefined);
		} else {
			countResult = await db.select({ total: sql<number>`count(*)` }).from(hpInvoiceTitles);
		}

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 - 关联查询 */
		let data;
		if (query.ownerName) {
			data = await db
				.select({
					id: hpInvoiceTitles.id,
					code: hpInvoiceTitles.titleName,
					ownerName: hpOwners.name,
					invoiceType: hpOwners.phone,
					invoiceTitle: hpInvoiceTitles.titleName,
					taxpayerId: hpInvoiceTitles.taxpayerNo,
					address: hpInvoiceTitles.addressPhone,
					phone: hpInvoiceTitles.addressPhone,
					bankAccount: hpInvoiceTitles.bankAccount,
					remark: hpInvoiceTitles.remark,
					createTime: hpInvoiceTitles.createTime,
					updateTime: hpInvoiceTitles.updateTime,
				})
				.from(hpInvoiceTitles)
				.innerJoin(hpOwners, eq(hpInvoiceTitles.ownerId, hpOwners.id))
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(orderBy)
				.limit(query.pageSize)
				.offset(offset);
		} else {
			data = await db
				.select({
					id: hpInvoiceTitles.id,
					code: hpInvoiceTitles.titleName,
					ownerName: hpOwners.name,
					invoiceType: hpOwners.phone,
					invoiceTitle: hpInvoiceTitles.titleName,
					taxpayerId: hpInvoiceTitles.taxpayerNo,
					address: hpInvoiceTitles.addressPhone,
					phone: hpInvoiceTitles.addressPhone,
					bankAccount: hpInvoiceTitles.bankAccount,
					remark: hpInvoiceTitles.remark,
					createTime: hpInvoiceTitles.createTime,
					updateTime: hpInvoiceTitles.updateTime,
				})
				.from(hpInvoiceTitles)
				.leftJoin(hpOwners, eq(hpInvoiceTitles.ownerId, hpOwners.id))
				.orderBy(orderBy)
				.limit(query.pageSize)
				.offset(offset);
		}

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: InvoiceTitleListItem[] = data.map((item) => ({
			id: item.id || "",
			code: item.code || "",
			ownerName: item.ownerName || "",
			invoiceType: item.invoiceType || "",
			invoiceTitle: item.invoiceTitle || "",
			taxpayerId: item.taxpayerId || "",
			address: item.address || "",
			phone: item.phone || "",
			bankAccount: item.bankAccount || "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
			remark: item.remark || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<InvoiceTitleListItem>> = {
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
		console.error("[InvoiceTitle List] Error:", error);
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "查询失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
