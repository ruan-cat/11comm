/**
 * @file Property Register 列表接口
 * @description Property Register list API
 * POST /api/property-manage/community-manage/property-register/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { db } from "server/db";
import { cmPropertyRegisters } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
	communityName: z.string().optional(),
	buildingNo: z.string().optional(),
	unitNo: z.string().optional(),
	roomNo: z.string().optional(),
	ownerName: z.string().optional(),
	contactPhone: z.string().optional(),
	propertyType: z.string().optional(),
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
			communityName: body.communityName === "" ? undefined : body.communityName,
			buildingNo: body.buildingNo === "" ? undefined : body.buildingNo,
			unitNo: body.unitNo === "" ? undefined : body.unitNo,
			roomNo: body.roomNo === "" ? undefined : body.roomNo,
			ownerName: body.ownerName === "" ? undefined : body.ownerName,
			contactPhone: body.contactPhone === "" ? undefined : body.contactPhone,
			propertyType: body.propertyType === "" ? undefined : body.propertyType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.communityName) {
			conditions.push(like(cmPropertyRegisters.communityName, `%${query.communityName}%`));
		}

		if (query.buildingNo) {
			conditions.push(like(cmPropertyRegisters.buildingNo, `%${query.buildingNo}%`));
		}

		if (query.unitNo) {
			conditions.push(like(cmPropertyRegisters.unitNo, `%${query.unitNo}%`));
		}

		if (query.roomNo) {
			conditions.push(like(cmPropertyRegisters.roomNo, `%${query.roomNo}%`));
		}

		if (query.ownerName) {
			conditions.push(like(cmPropertyRegisters.ownerName, `%${query.ownerName}%`));
		}

		if (query.contactPhone) {
			conditions.push(like(cmPropertyRegisters.contactPhone, `%${query.contactPhone}%`));
		}

		if (query.propertyType) {
			conditions.push(like(cmPropertyRegisters.propertyType, `%${query.propertyType}%`));
		}

		if (query.status) {
			conditions.push(eq(cmPropertyRegisters.status, query.status as any));
		}

		/** 计算分页参数 */
		const offset = (query.pageIndex - 1) * query.pageSize;

		/** 查询总数 */
		const [countResult] = await db
			.select({ total: sql<number>`count(*)` })
			.from(cmPropertyRegisters)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: cmPropertyRegisters.id,
				communityName: cmPropertyRegisters.communityName,
				buildingNo: cmPropertyRegisters.buildingNo,
				unitNo: cmPropertyRegisters.unitNo,
				roomNo: cmPropertyRegisters.roomNo,
				ownerName: cmPropertyRegisters.ownerName,
				contactPhone: cmPropertyRegisters.contactPhone,
				area: cmPropertyRegisters.area,
				propertyType: cmPropertyRegisters.propertyType,
				registerDate: cmPropertyRegisters.registerDate,
				status: cmPropertyRegisters.status,
				remark: cmPropertyRegisters.remark,
				createTime: cmPropertyRegisters.createTime,
				updateTime: cmPropertyRegisters.updateTime,
			})
			.from(cmPropertyRegisters)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(cmPropertyRegisters.createTime))
			.limit(query.pageSize)
			.offset(offset);

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		/** 格式化时间字段 */
		const list = data.map((item) => ({
			...item,
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
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
		console.error("[Property Register List] Error:", error);
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
