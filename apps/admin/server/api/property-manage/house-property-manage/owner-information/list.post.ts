/**
 * @file Owner Information 列表接口
 * @description Owner Information list API
 * POST /api/property-manage/house-property-manage/owner-information/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { hpOwners } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { OwnerInformationListItem, OwnerInformationQueryParams } from "@01s-11comm/type";
import { and, desc, like, asc, sql, eq } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	personType: z.string().optional(),
	ownerName: z.string().optional(),
	houseNo: z.string().optional(),
	phone: z.string().optional(),
	idCard: z.string().optional(),
	sortBy: z.enum(["createTime", "updateTime"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OwnerInformationListItem>>> => {
	try {
		/** 获取并验证查询参数 */
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			personType: body.personType === "" ? undefined : body.personType,
			ownerName: body.ownerName === "" ? undefined : body.ownerName,
			houseNo: body.houseNo === "" ? undefined : body.houseNo,
			phone: body.phone === "" ? undefined : body.phone,
			idCard: body.idCard === "" ? undefined : body.idCard,
		};

		const query = querySchema.parse(rawQuery);

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 构建查询条件 */
		const conditions = [];

		if (query.ownerName) {
			conditions.push(like(hpOwners.name, `%${query.ownerName}%`));
		}

		if (query.phone) {
			conditions.push(like(hpOwners.phone, `%${query.phone}%`));
		}

		if (query.idCard) {
			conditions.push(like(hpOwners.idCard, `%${query.idCard}%`));
		}

		/** 构建排序 */
		const sortBy = query.sortBy || "createTime";
		const sortOrder = query.sortOrder || "desc";

		const sortFields: Record<string, any> = {
			createTime: hpOwners.createTime,
			updateTime: hpOwners.updateTime,
		};

		const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : asc(sortFields[sortBy]);

		/** 查询总数 */
		const countResult = await db
			.select({ total: sql<number>`count(*)` })
			.from(hpOwners)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult[0]?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: hpOwners.id,
				name: hpOwners.name,
				idCard: hpOwners.idCard,
				phone: hpOwners.phone,
				gender: hpOwners.gender,
				email: hpOwners.email,
				address: hpOwners.address,
				emergencyContact: hpOwners.emergencyContact,
				remark: hpOwners.remark,
				createTime: hpOwners.createTime,
				updateTime: hpOwners.updateTime,
			})
			.from(hpOwners)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(orderBy)
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list: OwnerInformationListItem[] = data.map((item) => ({
			id: item.id,
			name: item.name || "",
			status: "启用",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
			remark: item.remark || "",
			gender: item.gender || "",
			phone: item.phone || "",
			idCard: item.idCard || "",
			emergencyContact: item.emergencyContact || "",
			address: item.address || "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<OwnerInformationListItem>> = {
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
		console.error("[Owner Information List] Error:", error);
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
