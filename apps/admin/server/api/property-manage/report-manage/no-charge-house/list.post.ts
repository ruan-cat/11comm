/**
 * @file No Charge House 列表接口
 * @description No Charge House list API
 * POST /api/property-manage/report-manage/no-charge-house/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { rptNoChargeHouses } from "@01s-11comm/type";
import type { JsonVO, PageDTO, NoChargeHouseListItem, NoChargeHouseQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, and } from "drizzle-orm";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	houseNumberContractName: z.string().optional(),
	ownerName: z.string().optional(),
	ownerPhone: z.string().optional(),
	community: z.string().optional(),
	building: z.string().optional(),
	unit: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<NoChargeHouseListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<NoChargeHouseQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			houseNumberContractName: body.houseNumberContractName,
			ownerName: body.ownerName,
			ownerPhone: body.ownerPhone,
			community: body.community,
			building: body.building,
			unit: body.unit,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 构建查询条件
		const conditions = [];

		if (query.houseNumberContractName) {
			conditions.push(like(rptNoChargeHouses.houseNumber, `%${query.houseNumberContractName}%`));
		}

		if (query.ownerName) {
			conditions.push(like(rptNoChargeHouses.ownerInfo, `%${query.ownerName}%`));
		}

		// 查询总数
		const countResult = await db
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptNoChargeHouses);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await db
			.select({
				id: rptNoChargeHouses.id,
				houseNumber: rptNoChargeHouses.houseNumber,
				ownerInfo: rptNoChargeHouses.ownerInfo,
				noChargeReason: rptNoChargeHouses.noChargeReason,
				lastChargeDate: rptNoChargeHouses.lastChargeDate,
				remark: rptNoChargeHouses.remark,
				createTime: rptNoChargeHouses.createTime,
				updateTime: rptNoChargeHouses.updateTime,
			})
			.from(rptNoChargeHouses)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(rptNoChargeHouses.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: NoChargeHouseListItem[] = data.map((item) => ({
			id: item.id || "",
			community: "",
			building: "",
			unit: "",
			houseNumberContractName: item.houseNumber || "",
			ownerName: item.ownerInfo || "",
			ownerPhone: "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<NoChargeHouseListItem>> = {
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
		console.error("[No Charge House List] Error:", error);
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
