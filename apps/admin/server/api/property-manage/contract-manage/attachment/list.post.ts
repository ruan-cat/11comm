/**
 * @file 合同附件列表接口
 * @description Attachment list API
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { ctAttachments, ctContracts } from "@01s-11comm/type";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { and, desc, eq, like, sql } from "drizzle-orm";
import { formatDateTime } from "server/utils/format-date";

/** 附件查询参数验证 schema */
const querySchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
	attachmentName: z.string().optional(),
	contractNumber: z.string().optional(),
	contractName: z.string().optional(),
	attachmentType: z.string().optional(),
	status: z.string().optional(),
});

/**
 * 合同附件列表 POST API
 * Attachment list POST API
 */
export default defineHandler(async (event) => {
	try {
		const db = useDb(event);
		const body = (await readBody(event)) as any;

		/** 预处理参数 */
		const rawQuery = {
			...body,
			page: body.page || body.pageIndex || 1,
			attachmentName: body.attachmentName === "" ? undefined : body.attachmentName,
			contractNumber: body.contractNumber === "" ? undefined : body.contractNumber,
			contractName: body.contractName === "" ? undefined : body.contractName,
			attachmentType: body.attachmentType === "" ? undefined : body.attachmentType,
			status: body.status === "" ? undefined : body.status,
		};

		const query = querySchema.parse(rawQuery);

		/** 构建查询条件 */
		const conditions = [];

		if (query.attachmentName) {
			conditions.push(like(ctAttachments.attachmentName, `%${query.attachmentName}%`));
		}

		if (query.contractNumber) {
			conditions.push(like(ctContracts.contractNumber, `%${query.contractNumber}%`));
		}

		if (query.contractName) {
			conditions.push(like(ctContracts.contractName, `%${query.contractName}%`));
		}

		if (query.attachmentType) {
			conditions.push(eq(ctAttachments.attachmentType, query.attachmentType));
		}

		// status 在数据库中没有对应字段，跳过

		/** 计算分页参数 */
		const offset = (query.page - 1) * query.pageSize;

		/** 查询总数 - 使用子查询关联 */
		const countSubQuery = db
			.select({
				attachmentId: ctAttachments.id,
			})
			.from(ctAttachments)
			.leftJoin(ctContracts, eq(ctAttachments.contractId, ctContracts.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.as("count_sub");

		const [countResult] = await db.select({ total: sql<number>`count(*)` }).from(countSubQuery);

		const total = Number(countResult?.total || 0);

		/** 查询分页数据 */
		const data = await db
			.select({
				id: ctAttachments.id,
				attachmentName: ctAttachments.attachmentName,
				fileName: ctAttachments.attachmentName,
				contractNumber: ctContracts.contractNumber,
				contractName: ctContracts.contractName,
				attachmentType: ctAttachments.attachmentType,
				fileType: ctAttachments.attachmentType,
				fileSize: ctAttachments.fileSize,
				fileFormat: sql<string>`null`, // 简化处理
				uploader: ctAttachments.createTime, // 简化处理
				uploadTime: ctAttachments.createTime,
				status: sql<string>`'正常'`, // 简化处理
				remark: ctAttachments.remark,
				createTime: ctAttachments.createTime,
				updateTime: ctAttachments.updateTime,
			})
			.from(ctAttachments)
			.leftJoin(ctContracts, eq(ctAttachments.contractId, ctContracts.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(ctAttachments.createTime))
			.limit(query.pageSize)
			.offset(offset);

		/** 转换数据格式 */
		const list = data.map((item) => ({
			id: item.id,
			attachmentName: item.attachmentName || "",
			fileName: item.fileName || "",
			contractNumber: item.contractNumber || "",
			contractName: item.contractName || "",
			attachmentType: item.attachmentType || "",
			fileType: item.fileType || "",
			fileSize: item.fileSize || "",
			fileFormat: item.fileFormat || "",
			uploader: item.uploader || "",
			uploadTime: item.uploadTime || "",
			status: item.status || "",
			remark: item.remark || "",
			createTime: item.createTime ? formatDateTime(item.createTime) : "",
			updateTime: item.updateTime ? formatDateTime(item.updateTime) : "",
		}));

		/** 计算总页数 */
		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<(typeof list)[number]>> = {
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
		console.error("[Attachment List] Error:", error);
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
