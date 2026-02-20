/**
 * @file Discount Apply 列表接口
 * @description Discount Apply list API
 * POST /api/property-manage/expense-manage/discount-apply/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { exDiscountApplications } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	applicant: z.string().optional(),
	applicationType: z.string().optional(),
	auditStatus: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event) => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			applicant: body.applicant === "" ? undefined : body.applicant,
			applicationType: body.applicationType === "" ? undefined : body.applicationType,
			auditStatus: body.auditStatus === "" ? undefined : body.auditStatus,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.applicant) {
			conditions.push(like(exDiscountApplications.applicant, `%${query.applicant}%`));
		}

		if (query.applicationType) {
			conditions.push(eq(exDiscountApplications.applicationType, query.applicationType));
		}

		if (query.auditStatus) {
			conditions.push(eq(exDiscountApplications.auditStatus, query.auditStatus as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: exDiscountApplications.createTime,
			updateTime: exDiscountApplications.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await useDb(event)
			.select({ total: sql<number>`count(*)` })
			.from(exDiscountApplications)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await useDb(event)
			.select({
				id: exDiscountApplications.id,
				discountSettingId: exDiscountApplications.discountSettingId,
				applicant: exDiscountApplications.applicant,
				applicationType: exDiscountApplications.applicationType,
				applicationReason: exDiscountApplications.applicationReason,
				applicationAmount: exDiscountApplications.applicationAmount,
				auditStatus: exDiscountApplications.auditStatus,
				auditor: exDiscountApplications.auditor,
				auditTime: exDiscountApplications.auditTime,
				auditOpinion: exDiscountApplications.auditOpinion,
				remark: exDiscountApplications.remark,
				createTime: exDiscountApplications.createTime,
				updateTime: exDiscountApplications.updateTime,
			})
			.from(exDiscountApplications)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			discountSettingId: item.discountSettingId,
			applicant: item.applicant || "",
			applicationType: item.applicationType || "",
			applicationReason: item.applicationReason || "",
			applicationAmount: item.applicationAmount || "",
			auditStatus: item.auditStatus || "pending",
			auditor: item.auditor || "",
			auditTime: formatDateTime(item.auditTime),
			auditOpinion: item.auditOpinion || "",
			remark: item.remark || "",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
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
				pageSize: query.pageSize,
				pageIndex: query.page,
				totalPages,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[Discount Apply List] Error:", error);
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
