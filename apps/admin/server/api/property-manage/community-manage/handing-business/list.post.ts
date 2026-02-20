/**
 * @file Handing Business 列表接口
 * @description Handing Business list API
 * POST /api/property-manage/community-manage/handing-business/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { cmHandingBusiness } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	businessType: z.string().optional(),
	applicant: z.string().optional(),
	contactPhone: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		const db = useDb(event);
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数：映射 pageIndex，空字符串清洗为 undefined */
		const rawQuery = {
			...body,
			pageIndex: body.pageIndex || 1,
			businessType: body.businessType === "" ? undefined : body.businessType,
			applicant: body.applicant === "" ? undefined : body.applicant,
			contactPhone: body.contactPhone === "" ? undefined : body.contactPhone,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.businessType) {
			conditions.push(like(cmHandingBusiness.businessType, `%${query.businessType}%`));
		}

		if (query.applicant) {
			conditions.push(like(cmHandingBusiness.applicant, `%${query.applicant}%`));
		}

		if (query.contactPhone) {
			conditions.push(like(cmHandingBusiness.contactPhone, `%${query.contactPhone}%`));
		}

		if (query.status) {
			conditions.push(eq(cmHandingBusiness.status, query.status));
		}

		/** 计算分页参数 */
		const offset = (query.pageIndex - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(cmHandingBusiness)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: cmHandingBusiness.id,
				businessType: cmHandingBusiness.businessType,
				applicant: cmHandingBusiness.applicant,
				contactPhone: cmHandingBusiness.contactPhone,
				status: cmHandingBusiness.status,
				handleTime: cmHandingBusiness.handleTime,
				remark: cmHandingBusiness.remark,
				createTime: cmHandingBusiness.createTime,
				updateTime: cmHandingBusiness.updateTime,
			})
			.from(cmHandingBusiness)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(cmHandingBusiness.createTime))
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		/** 格式化时间字段 */
		const list = data.map((item) => ({
			...item,
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		const response: JsonVO<PageDTO<(typeof list)[number]>> = {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list,
				total,
				pageSize: query.pageSize,
				pageIndex: query.pageIndex,
				totalPages,
			},
		};

		return response;
	} catch (error: any) {
		console.error("[Handing Business List] Error:", error);
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
