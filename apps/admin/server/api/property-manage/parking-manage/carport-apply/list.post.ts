/**
 * @file Carport Apply 列表接口
 * @description Carport Apply list API
 * POST /api/property-manage/parking-manage/carport-apply/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { pkCarportApplications } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { CarportApplyListItem, CarportApplyQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	applicant: z.string().optional(),
	carportType: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createdAt", "updatedAt", "applyTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<CarportApplyListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			applicant: body.applicant === "" ? undefined : body.applicant,
			carportType: body.carportType === "" ? undefined : body.carportType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.applicant) {
			conditions.push(like(pkCarportApplications.applicant, `%${query.applicant}%`));
		}

		if (query.carportType) {
			conditions.push(eq(pkCarportApplications.carportType, query.carportType));
		}

		if (query.status) {
			conditions.push(eq(pkCarportApplications.status, query.status));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createdAt";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createdAt: pkCarportApplications.createdAt,
			updatedAt: pkCarportApplications.updatedAt,
			applyTime: pkCarportApplications.applyTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(pkCarportApplications)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: pkCarportApplications.id,
				applicant: pkCarportApplications.applicant,
				carportType: pkCarportApplications.carportType,
				applyTime: pkCarportApplications.applyTime,
				expectedPriceRange: pkCarportApplications.expectedPriceRange,
				status: pkCarportApplications.status,
				approver: pkCarportApplications.approver,
				approvalTime: pkCarportApplications.approvalTime,
				approvalOpinion: pkCarportApplications.approvalOpinion,
				allocatedCarport: pkCarportApplications.allocatedCarport,
				createdAt: pkCarportApplications.createdAt,
				updatedAt: pkCarportApplications.updatedAt,
			})
			.from(pkCarportApplications)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 - 映射数据库字段到前端类型字段 */
		const list: CarportApplyListItem[] = data.map((item) => ({
			applicationId: item.id || "",
			licensePlate: "", // 需要关联查询车辆信息
			parkingSpace: item.allocatedCarport || "",
			carBrand: "",
			vehicleType: item.carportType || "",
			color: "",
			startLeaseTime: "",
			endLeaseTime: "",
			applicant: item.applicant || "",
			phoneNumber: "",
			reviewResult: item.status || "",
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<CarportApplyListItem>> = {
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
		console.error("[CarportApply List] Error:", error);
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
