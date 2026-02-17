/**
 * @file Site Management 列表接口
 * @description Site Management list API
 * POST /api/property-manage/house-property-manage/site-management/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { hpSiteManagements } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { SiteManagementListItem, SiteManagementQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	siteName: z.string().optional(),
	location: z.string().optional(),
	manager: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<SiteManagementListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			siteName: body.siteName === "" ? undefined : body.siteName,
			location: body.location === "" ? undefined : body.location,
			manager: body.manager === "" ? undefined : body.manager,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.siteName) {
			conditions.push(like(hpSiteManagements.siteName, `%${query.siteName}%`));
		}

		if (query.location) {
			conditions.push(like(hpSiteManagements.location, `%${query.location}%`));
		}

		if (query.manager) {
			conditions.push(like(hpSiteManagements.manager, `%${query.manager}%`));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: hpSiteManagements.createTime,
			updateTime: hpSiteManagements.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(hpSiteManagements)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: hpSiteManagements.id,
				siteName: hpSiteManagements.siteName,
				location: hpSiteManagements.location,
				manager: hpSiteManagements.manager,
				maintenanceRecord: hpSiteManagements.maintenanceRecord,
				remark: hpSiteManagements.remark,
				createTime: hpSiteManagements.createTime,
				updateTime: hpSiteManagements.updateTime,
			})
			.from(hpSiteManagements)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: SiteManagementListItem[] = data.map((item) => ({
			id: item.id,
			idNumber: item.siteName?.substring(0, 10) || "",
			name: item.siteName || "",
			openingTime: item.manager || "09:00",
			closingTime: item.manager || "21:00",
			hourlyFee: "",
			administrator: item.manager || "",
			administratorPhone: "",
			status: "启用",
			createTime: formatDateTime(item.createTime),
			remark: item.remark || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<SiteManagementListItem>> = {
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
		console.error("[Site Management List] Error:", error);
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
