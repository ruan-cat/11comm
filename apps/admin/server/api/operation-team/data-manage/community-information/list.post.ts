/**
 * @file community information-列表接口
 * @description community information list API
 * POST /api/operation-team/data-manage/community-information/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { cmCommunities } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	communityId: z.string().optional(),
	communityName: z.string().optional(),
	province: z.string().optional(),
	city: z.string().optional(),
	district: z.string().optional(),
	propertyCompany: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<any>>> => {
	try {
		// 1. 读取并验证查询参数
		const body = (await readBody(event)) as any;
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			communityName: body.communityName === "" ? undefined : body.communityName,
			communityId: body.communityId === "" ? undefined : body.communityId,
			province: body.province === "" ? undefined : body.province,
			city: body.city === "" ? undefined : body.city,
			district: body.district === "" ? undefined : body.district,
			propertyCompany: body.propertyCompany === "" ? undefined : body.propertyCompany,
			status: body.status === "" ? undefined : body.status,
		};
		const query = querySchema.parse(rawQuery);

		const db = useDb(event);

		// 2. 构建查询条件
		const conditions = [];

		if (query.communityName) {
			conditions.push(like(cmCommunities.name, `%${query.communityName}%`));
		}

		if (query.communityId) {
			conditions.push(like(cmCommunities.code, `%${query.communityId}%`));
		}

		// 3. 计算分页偏移
		const offset = (query.page - 1) * query.pageSize;

		// 4. 并行执行：查询数据 + 查询总数
		const [data, countResult] = await Promise.all([
			db
				.select({
					id: cmCommunities.id,
					communityId: cmCommunities.code,
					communityName: cmCommunities.name,
					communityCode: cmCommunities.code,
					region: cmCommunities.district,
					cityCode: cmCommunities.city,
					address: cmCommunities.address,
					landArea: cmCommunities.landArea,
					buildingArea: cmCommunities.buildingArea,
					buildingCount: cmCommunities.buildingCount,
					unitCount: cmCommunities.unitCount,
					houseCount: cmCommunities.householdCount,
					parkingCount: cmCommunities.parkingCount,
					greenRate: cmCommunities.greenRate,
					plotRatio: cmCommunities.plotRatio,
					developer: cmCommunities.developer,
					propertyCompany: cmCommunities.propertyCompany,
					establishedTime: cmCommunities.establishedDate,
					contactPhone: cmCommunities.phone,
					status: cmCommunities.status,
					createTime: cmCommunities.createTime,
					updateTime: cmCommunities.updateTime,
					operator: cmCommunities.phone,
					province: cmCommunities.province,
					city: cmCommunities.city,
					district: cmCommunities.district,
					detailedAddress: cmCommunities.address,
					nearbyLandmark: cmCommunities.remark,
					administrator: cmCommunities.phone,
				})
				.from(cmCommunities)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(cmCommunities.createTime))
				.limit(query.pageSize)
				.offset(offset),

			db
				.select({ count: sql<number>`count(*)` })
				.from(cmCommunities)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		// 5. 计算总页数
		const total = Number(countResult[0]?.count || 0);
		const totalPages = Math.ceil(total / query.pageSize);

		// 6. 转换数据格式以匹配前端期望
		const list = data.map((item) => ({
			communityId: item.communityId || "",
			communityName: item.communityName || "",
			communityCode: item.communityCode || "",
			region: item.region || "",
			cityCode: item.cityCode || "",
			address: item.address || "",
			landArea: item.landArea || 0,
			buildingArea: item.buildingArea || 0,
			buildingCount: item.buildingCount || 0,
			unitCount: item.unitCount || 0,
			houseCount: item.houseCount || 0,
			parkingCount: item.parkingCount || 0,
			greenRate: item.greenRate || 0,
			plotRatio: item.plotRatio || 0,
			developer: item.developer || "",
			propertyCompany: item.propertyCompany || "",
			establishedTime: item.establishedTime ? new Date(item.establishedTime).toLocaleDateString("zh-CN") : "",
			contactPhone: item.contactPhone || "",
			status: item.status || "正常",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
			operator: item.operator || "",
			province: item.province || "",
			city: item.city || "",
			district: item.district || "",
			detailedAddress: item.detailedAddress || "",
			nearbyLandmark: item.nearbyLandmark || "",
			administrator: item.administrator || "",
		}));

		/** 返回标准格式 */
		const response: JsonVO<PageDTO<any>> = {
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
		console.error("[Community Information List] Error:", error);

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
