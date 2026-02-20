/**
 * @file report component-列表接口
 * @description report component list API
 * POST /api/operation-team/report-configuration/report-component/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { and, like, desc, sql } from "drizzle-orm";
import { opReportComponents, opReportInfos, selectOpReportComponentSchema } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

/** 报表组件列表查询参数 Schema */
const searchReportComponentSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	componentName: z.string().optional(),
	componentType: z.string().optional(),
	reportId: z.string().optional(),
});

type SearchReportComponent = z.infer<typeof searchReportComponentSchema>;

/** 报表组件列表项（兼容前端格式） */
interface ReportComponentListItem {
	id: string;
	componentName: string;
	componentCode: string;
	componentType: string;
	reportId: string;
	reportName: string;
	componentConfig: string;
	dataBinding: string;
	styleConfig: string;
	eventConfig: string;
	queryMethod: string;
	sql: string;
	java: string;
	description: string;
	sortOrder: number;
	isEnabled: boolean;
	createTime: string;
	updateTime: string;
	operator: string;
}

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ReportComponentListItem>>> => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
		};
		const query = searchReportComponentSchema.parse(rawQuery);

		const db = useDb(event);

		// 2. 构建动态查询条件
		const conditions = [];

		// 模糊搜索：组件名称
		if (query.componentName) {
			conditions.push(like(opReportComponents.componentName, `%${query.componentName}%`));
		}

		// 精确匹配：组件类型
		if (query.componentType) {
			conditions.push(sql`${opReportComponents.componentType} = ${query.componentType}`);
		}

		// 精确匹配：报表ID
		if (query.reportId) {
			conditions.push(sql`${opReportComponents.reportId} = ${query.reportId}::uuid`);
		}

		// 3. 计算分页偏移
		const offset = (query.page - 1) * query.pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select({
					id: opReportComponents.id,
					componentName: opReportComponents.componentName,
					componentType: opReportComponents.componentType,
					componentConfig: sql<string>`COALESCE(${opReportComponents.componentConfig}::text, '')`,
					reportId: opReportComponents.reportId,
					createTime: sql<string>`${opReportComponents.createTime}::text`,
					updateTime: sql<string>`${opReportComponents.updateTime}::text`,
				})
				.from(opReportComponents)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(opReportComponents.createTime))
				.limit(query.pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`cast(count(${opReportComponents.id}) as int)` })
				.from(opReportComponents)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		// 5. 转换数据格式以匹配前端期望
		const list: ReportComponentListItem[] = data.map((item) => ({
			id: item.id,
			componentName: item.componentName || "",
			componentCode: "",
			componentType: item.componentType || "",
			reportId: item.reportId || "",
			reportName: "",
			componentConfig: item.componentConfig || "",
			dataBinding: "",
			styleConfig: "",
			eventConfig: "",
			queryMethod: "",
			sql: "",
			java: "",
			description: "",
			sortOrder: 0,
			isEnabled: true,
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			operator: "",
		}));

		// 6. 返回标准分页结构
		const total = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<ReportComponentListItem>> = {
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
		console.error("[Report Component List] Error:", error);

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
