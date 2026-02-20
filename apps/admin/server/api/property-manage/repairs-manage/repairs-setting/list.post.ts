/**
 * @file Repairs Setting 列表接口
 * @description Repairs Setting list API
 * POST /api/property-manage/repairs-manage/repairs-setting/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { rpRepairSettings } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { RepairsSettingListItem, RepairsSettingQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq, isNull } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	typeName: z.string().optional(),
	dispatchMethod: z.string().optional(),
	settingType: z.string().optional(),
	publicArea: z.string().optional(),
	returnVisitSetting: z.string().optional(),
	status: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<RepairsSettingListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			typeName: body.typeName === "" ? undefined : body.typeName,
			dispatchMethod: body.dispatchMethod === "" ? undefined : body.dispatchMethod,
			settingType: body.settingType === "" ? undefined : body.settingType,
			publicArea: body.publicArea === "" ? undefined : body.publicArea,
			returnVisitSetting: body.returnVisitSetting === "" ? undefined : body.returnVisitSetting,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		const db = useDb(event);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		// 移除 deletedAt 检查，因为表结构可能没有此字段

		if (query.typeName) {
			conditions.push(like(rpRepairSettings.settingType, `%${query.typeName}%`));
		}

		if (query.dispatchMethod) {
			conditions.push(eq(rpRepairSettings.dispatchMethod, query.dispatchMethod as any));
		}

		if (query.settingType) {
			conditions.push(eq(rpRepairSettings.settingType, query.settingType as any));
		}

		if (query.publicArea) {
			conditions.push(eq(rpRepairSettings.serviceArea, query.publicArea as any));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: rpRepairSettings.createTime,
			updateTime: rpRepairSettings.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(rpRepairSettings)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: rpRepairSettings.id,
				settingType: rpRepairSettings.settingType,
				dispatchMethod: rpRepairSettings.dispatchMethod,
				serviceArea: rpRepairSettings.serviceArea,
				processingTimeLimit: rpRepairSettings.processingTimeLimit,
				returnVisitTimeLimit: rpRepairSettings.returnVisitTimeLimit,
				createTime: rpRepairSettings.createTime,
				updateTime: rpRepairSettings.updateTime,
			})
			.from(rpRepairSettings)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: RepairsSettingListItem[] = data.map((item) => ({
			id: item.id || "",
			typeName: item.settingType || "",
			settingType: item.settingType || "",
			dispatchMethod: item.dispatchMethod || "",
			publicArea: item.serviceArea || "",
			ownerDisplay: "yes",
			notificationMethod: "",
			returnVisitSetting: item.returnVisitTimeLimit ? "visit" : "no_visit",
			status: "enabled",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			remark: "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<RepairsSettingListItem>> = {
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
		console.error("[RepairsSetting List] Error:", error);
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
