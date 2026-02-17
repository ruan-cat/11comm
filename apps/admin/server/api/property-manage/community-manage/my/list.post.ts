/**
 * @file My 列表接口
 * @description My list API
 * POST /api/property-manage/community-manage/my/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { cmCommunities } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	province: z.string().optional(),
	city: z.string().optional(),
	district: z.string().optional(),
	communityName: z.string().optional(),
	communityCode: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数：映射 pageIndex，空字符串清洗为 undefined */
		const rawQuery = {
			...body,
			pageIndex: body.pageIndex || 1,
			province: body.province === "" ? undefined : body.province,
			city: body.city === "" ? undefined : body.city,
			district: body.district === "" ? undefined : body.district,
			communityName: body.communityName === "" ? undefined : body.communityName,
			communityCode: body.communityCode === "" ? undefined : body.communityCode,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.province) {
			conditions.push(eq(cmCommunities.province, query.province));
		}

		if (query.city) {
			conditions.push(eq(cmCommunities.city, query.city));
		}

		if (query.district) {
			conditions.push(eq(cmCommunities.district, query.district));
		}

		if (query.communityName) {
			conditions.push(like(cmCommunities.name, `%${query.communityName}%`));
		}

		if (query.communityCode) {
			conditions.push(like(cmCommunities.code, `%${query.communityCode}%`));
		}

		if (query.status) {
			conditions.push(eq(cmCommunities.status, query.status as any));
		}

		/** 计算分页参数 */
		const offset = (query.pageIndex - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(cmCommunities)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: cmCommunities.id,
				communityName: cmCommunities.name,
				communityCode: cmCommunities.code,
				address: cmCommunities.address,
				phone: cmCommunities.phone,
				province: cmCommunities.province,
				city: cmCommunities.city,
				district: cmCommunities.district,
				landArea: cmCommunities.landArea,
				buildingArea: cmCommunities.buildingArea,
				buildingCount: cmCommunities.buildingCount,
				unitCount: cmCommunities.unitCount,
				householdCount: cmCommunities.householdCount,
				parkingCount: cmCommunities.parkingCount,
				greenRate: cmCommunities.greenRate,
				plotRatio: cmCommunities.plotRatio,
				developer: cmCommunities.developer,
				propertyCompany: cmCommunities.propertyCompany,
				establishedDate: cmCommunities.establishedDate,
				status: cmCommunities.status,
				remark: cmCommunities.remark,
				createdAt: cmCommunities.createdAt,
				updatedAt: cmCommunities.updatedAt,
			})
			.from(cmCommunities)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(cmCommunities.createdAt))
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		/** 格式化时间字段 */
		const list = data.map((item) => ({
			...item,
			createTime: item.createdAt ? formatDateTime(item.createdAt) : "",
			updateTime: item.updatedAt ? formatDateTime(item.updatedAt) : "",
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
		console.error("[My Community List] Error:", error);
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
