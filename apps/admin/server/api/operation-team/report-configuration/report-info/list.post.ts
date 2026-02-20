/**
 * @file report info-列表接口
 * @description report info list API
 * POST /api/operation-team/report-configuration/report-info/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { and, like, desc, sql } from "drizzle-orm";
import { opReportInfos, opReportGroups } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

/** 报表信息列表查询参数 Schema */
const searchReportInfoSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	reportName: z.string().optional(),
	reportCode: z.string().optional(),
	groupId: z.string().optional(),
	reportType: z.string().optional(),
});

type SearchReportInfo = z.infer<typeof searchReportInfoSchema>;

/** 报表信息列表项（兼容前端格式） */
interface ReportInfoListItem {
	id: string;
	reportName: string;
	reportCode: string;
	groupId: string;
	groupName: string;
	reportType: string;
	dataSource: string;
	sqlQuery: string;
	description: string;
	fieldConfig: string;
	parameterConfig: string;
	isCache: boolean;
	cacheDuration: number;
	isEnabled: boolean;
	sortOrder: number;
	createTime: string;
	updateTime: string;
	operator: string;
}

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ReportInfoListItem>>> => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
		};
		const query = searchReportInfoSchema.parse(rawQuery);

		// 2. 构建动态查询条件
		const conditions = [];

		// 模糊搜索：报表名称
		if (query.reportName) {
			conditions.push(like(opReportInfos.reportName, `%${query.reportName}%`));
		}

		// 模糊搜索：报表编码
		if (query.reportCode) {
			conditions.push(like(opReportInfos.reportCode, `%${query.reportCode}%`));
		}

		// 精确匹配：分组ID
		if (query.groupId) {
			conditions.push(sql`${opReportInfos.groupId} = ${query.groupId}::uuid`);
		}

		// 精确匹配：报表类型
		if (query.reportType) {
			conditions.push(sql`${opReportInfos.reportType} = ${query.reportType}`);
		}

		// 3. 计算分页偏移
		const offset = (query.page - 1) * query.pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select({
					id: opReportInfos.id,
					reportName: opReportInfos.reportName,
					reportCode: opReportInfos.reportCode,
					groupId: opReportInfos.groupId,
					reportType: opReportInfos.reportType,
					dataSourceConfig: sql<string>`COALESCE(${opReportInfos.dataSourceConfig}::text, '')`,
					createTime: sql<string>`${opReportInfos.createTime}::text`,
					updateTime: sql<string>`${opReportInfos.updateTime}::text`,
				})
				.from(opReportInfos)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(opReportInfos.createTime))
				.limit(query.pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`cast(count(${opReportInfos.id}) as int)` })
				.from(opReportInfos)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		// 5. 转换数据格式以匹配前端期望
		const list: ReportInfoListItem[] = data.map((item) => ({
			id: item.id,
			reportName: item.reportName || "",
			reportCode: item.reportCode || "",
			groupId: item.groupId || "",
			groupName: "",
			reportType: item.reportType || "",
			dataSource: "",
			sqlQuery: "",
			description: "",
			fieldConfig: "",
			parameterConfig: "",
			isCache: false,
			cacheDuration: 0,
			isEnabled: true,
			sortOrder: 0,
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			operator: "",
		}));

		// 6. 返回标准分页结构
		const total = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<ReportInfoListItem>> = {
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
		console.error("[Report Info List] Error:", error);

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
