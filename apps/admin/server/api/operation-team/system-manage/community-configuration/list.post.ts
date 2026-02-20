/**
 * @file community configuration-列表接口
 * @description community configuration list API
 * POST /api/operation-team/system-manage/community-configuration/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { and, eq, like, desc, sql } from "drizzle-orm";
import { smCommunityConfigurations } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";

/** 小区配置列表查询参数 Schema */
const searchCommunityConfigurationSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	communityId: z.string().optional(),
	communityName: z.string().optional(),
	settingName: z.string().optional(),
	settingType: z.string().optional(),
	status: z.string().optional(),
});

type SearchCommunityConfiguration = z.infer<typeof searchCommunityConfigurationSchema>;

/** 小区配置列表项 */
interface CommunityConfigurationListItem {
	csId: string;
	communityId: string;
	communityName: string;
	settingName: string;
	settingValue: string;
	settingType: string;
	statusCd: string;
	remark: string;
	createTime: string;
	updateTime: string;
	operator: string;
}

export default defineHandler(async (event): Promise<JsonVO<PageDTO<CommunityConfigurationListItem>>> => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
		};
		const query = searchCommunityConfigurationSchema.parse(rawQuery);

		// 2. 构建动态查询条件
		const conditions = [];

		// 精确查询：小区ID
		if (query.communityId) {
			conditions.push(eq(smCommunityConfigurations.communityId, query.communityId));
		}

		// 模糊搜索：小区名称
		if (query.communityName) {
			conditions.push(like(smCommunityConfigurations.communityName, `%${query.communityName}%`));
		}

		// 模糊搜索：设置名称
		if (query.settingName) {
			conditions.push(like(smCommunityConfigurations.settingName, `%${query.settingName}%`));
		}

		// 精确查询：设置类型
		if (query.settingType) {
			conditions.push(eq(smCommunityConfigurations.settingType, query.settingType));
		}

		// 精确查询：状态
		if (query.status) {
			conditions.push(eq(smCommunityConfigurations.statusCd, query.status));
		}

		// 3. 计算分页偏移
		const offset = (query.page - 1) * query.pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select({
					csId: smCommunityConfigurations.csId,
					communityId: smCommunityConfigurations.communityId,
					communityName: smCommunityConfigurations.communityName,
					settingName: smCommunityConfigurations.settingName,
					settingValue: smCommunityConfigurations.settingValue,
					settingType: smCommunityConfigurations.settingType,
					statusCd: smCommunityConfigurations.statusCd,
					remark: smCommunityConfigurations.remark,
					createTime: smCommunityConfigurations.createTime,
					updateTime: smCommunityConfigurations.updateTime,
					operator: smCommunityConfigurations.operator,
				})
				.from(smCommunityConfigurations)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(smCommunityConfigurations.createTime))
				.limit(query.pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`cast(count(${smCommunityConfigurations.id}) as int)` })
				.from(smCommunityConfigurations)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		// 5. 转换数据格式以匹配前端期望
		const list: CommunityConfigurationListItem[] = data.map((item) => ({
			csId: item.csId || "",
			communityId: item.communityId || "",
			communityName: item.communityName || "",
			settingName: item.settingName || "",
			settingValue: item.settingValue || "",
			settingType: item.settingType || "",
			statusCd: item.statusCd || "",
			remark: item.remark || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			operator: item.operator || "",
		}));

		// 6. 返回标准分页结构
		const total = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<CommunityConfigurationListItem>> = {
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
		console.error("[Community Configuration List] Error:", error);

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
