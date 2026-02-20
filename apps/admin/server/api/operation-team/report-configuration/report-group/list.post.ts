/**
 * @file report group-列表接口
 * @description report group list API
 * POST /api/operation-team/report-configuration/report-group/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { and, like, desc, sql } from "drizzle-orm";
import { opReportGroups } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

/** 报表组列表查询参数 Schema */
const searchReportGroupSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	groupName: z.string().optional(),
	groupCode: z.string().optional(),
});

type SearchReportGroup = z.infer<typeof searchReportGroupSchema>;

/** 报表组列表项（兼容前端格式） */
interface ReportGroupListItem {
	id: string;
	name: string;
	groupCode: string;
	description: string;
	url: string;
	remark: string;
	sortOrder: number;
	isEnabled: boolean;
	reportCount: number;
	createTime: string;
	updateTime: string;
	operator: string;
}

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ReportGroupListItem>>> => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
		};
		const query = searchReportGroupSchema.parse(rawQuery);

		const db = useDb(event);

		// 2. 构建动态查询条件
		const conditions = [];

		// 模糊搜索：分组名称
		if (query.groupName) {
			conditions.push(like(opReportGroups.groupName, `%${query.groupName}%`));
		}

		// 模糊搜索：分组编码
		if (query.groupCode) {
			conditions.push(like(opReportGroups.groupCode, `%${query.groupCode}%`));
		}

		// 3. 计算分页偏移
		const offset = (query.page - 1) * query.pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select({
					id: opReportGroups.id,
					groupName: opReportGroups.groupName,
					groupCode: opReportGroups.groupCode,
					groupDescription: opReportGroups.groupDescription,
					sortOrder: opReportGroups.sortOrder,
					createTime: sql<string>`${opReportGroups.createTime}::text`,
					updateTime: sql<string>`${opReportGroups.updateTime}::text`,
				})
				.from(opReportGroups)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(opReportGroups.createTime))
				.limit(query.pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`cast(count(${opReportGroups.id}) as int)` })
				.from(opReportGroups)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		// 5. 转换数据格式以匹配前端期望
		const list: ReportGroupListItem[] = data.map((item) => ({
			id: item.id,
			name: item.groupName || "",
			groupCode: item.groupCode || "",
			description: item.groupDescription || "",
			url: "",
			remark: "",
			sortOrder: item.sortOrder || 0,
			isEnabled: true,
			reportCount: 0,
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			operator: "",
		}));

		// 6. 返回标准分页结构
		const total = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<ReportGroupListItem>> = {
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
		console.error("[Report Group List] Error:", error);

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
