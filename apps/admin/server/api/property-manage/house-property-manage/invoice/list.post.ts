/**
 * @file Invoice 列表接口
 * @description Invoice list API
 * POST /api/property-manage/house-property-manage/invoice/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { hpInvoices } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { InvoiceListItem, InvoiceQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	code: z.string().optional(),
	invoiceType: z.string().optional(),
	ownerName: z.string().optional(),
	applicant: z.string().optional(),
	auditStatus: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime", "applicationTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<InvoiceListItem>>> => {
	try {
		const db = useDb(event);
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			code: body.code === "" ? undefined : body.code,
			invoiceType: body.invoiceType === "" ? undefined : body.invoiceType,
			ownerName: body.ownerName === "" ? undefined : body.ownerName,
			applicant: body.applicant === "" ? undefined : body.applicant,
			auditStatus: body.auditStatus === "" ? undefined : body.auditStatus,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.code) {
			conditions.push(like(hpInvoices.code, `%${query.code}%`));
		}

		if (query.invoiceType) {
			conditions.push(eq(hpInvoices.invoiceType, query.invoiceType as any));
		}

		if (query.ownerName) {
			conditions.push(like(hpInvoices.ownerName, `%${query.ownerName}%`));
		}

		if (query.applicant) {
			conditions.push(like(hpInvoices.applicant, `%${query.applicant}%`));
		}

		if (query.auditStatus) {
			conditions.push(eq(hpInvoices.auditStatus, query.auditStatus as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: hpInvoices.createTime,
			updateTime: hpInvoices.updateTime,
			applicationTime: hpInvoices.applicationTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(hpInvoices)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: hpInvoices.id,
				code: hpInvoices.code,
				invoiceType: hpInvoices.invoiceType,
				ownerName: hpInvoices.ownerName,
				applicant: hpInvoices.applicant,
				invoiceTitle: hpInvoices.invoiceTitle,
				taxpayerId: hpInvoices.taxpayerId,
				amount: hpInvoices.amount,
				invoiceNo: hpInvoices.invoiceNo,
				auditStatus: hpInvoices.auditStatus,
				applicationTime: hpInvoices.applicationTime,
				remark: hpInvoices.remark,
				createTime: hpInvoices.createTime,
				updateTime: hpInvoices.updateTime,
			})
			.from(hpInvoices)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: InvoiceListItem[] = data.map((item) => ({
			id: item.id || "",
			code: item.code || "",
			invoiceType: item.invoiceType || "",
			ownerName: item.ownerName || "",
			applicant: item.applicant || "",
			invoiceTitle: item.invoiceTitle || "",
			taxpayerId: item.taxpayerId || "",
			applicationAmount: item.amount?.toString() || "",
			invoiceNumber: item.invoiceNo || "",
			auditStatus: item.auditStatus || "",
			applicationTime: item.applicationTime ? formatDateTime(item.applicationTime) : "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
			remark: item.remark || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<InvoiceListItem>> = {
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
		console.error("[Invoice List] Error:", error);
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
