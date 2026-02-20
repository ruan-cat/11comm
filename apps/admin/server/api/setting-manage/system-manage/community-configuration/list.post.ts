/**
 * @file 系统管理-小区配置-小区配置列表接口
 * @description Community configuration list API
 * POST /api/setting-manage/system-manage/community-configuration/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { smCommunityConfigurations } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	communityId: z.string().optional(),
	communityName: z.string().optional(),
	settingName: z.string().optional(),
	settingType: z.string().optional(),
	statusCd: z.string().optional(),
});

export default defineHandler(async (event) => {
	const db = useDb(event);
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			communityName: body.communityName === "" ? undefined : body.communityName,
			settingName: body.settingName === "" ? undefined : body.settingName,
			settingType: body.settingType === "" ? undefined : body.settingType,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		// 模糊搜索设置名称
		if (query.settingName) {
			conditions.push(like(smCommunityConfigurations.settingName, `%${query.settingName}%`));
		}

		// 匹配设置类型
		if (query.settingType) {
			conditions.push(like(smCommunityConfigurations.settingType, `%${query.settingType}%`));
		}

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(smCommunityConfigurations)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: smCommunityConfigurations.id,
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
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const list = data.map((item) => ({
			...item,
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		const response: JsonVO<PageDTO<(typeof data)[number]>> = {
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
		console.error("[Community Configuration List] Error:", error);
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
