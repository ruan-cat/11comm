/**
 * @file Fee Reminder 列表接口
 * @description Fee Reminder list API
 * POST /api/property-manage/report-manage/fee-reminder/list
 */

import { defineHandler, readBody } from "nitro/h3";
import { z } from "zod";
import { useDb } from "server/db";
import { rptFeeReminders } from "@01s-11comm/type";
import type { JsonVO, PageDTO, FeeReminderListItem, FeeReminderQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { desc, like, sql, and } from "drizzle-orm";

import { formatDateTime } from "server/utils/format-date";

/** 查询参数验证 schema */
const querySchema = z.object({
	pageIndex: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE_INDEX),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_PAGE_SIZE),
	name: z.string().optional(),
	status: z.string().optional(),
});

export default defineHandler(async (event): Promise<JsonVO<PageDTO<FeeReminderListItem>>> => {
	try {
		const body = (await readBody(event)) as Partial<FeeReminderQueryParams>;
		const rawQuery = {
			pageIndex: body.pageIndex || DEFAULT_PAGE_INDEX,
			pageSize: body.pageSize || DEFAULT_PAGE_SIZE,
			name: body.name,
			status: body.status,
		};
		const query = querySchema.parse(rawQuery);
		const offset = (query.pageIndex - 1) * query.pageSize;

		// 查询总数
		const countResult = await useDb(event)
			.select({
				total: sql<number>`count(*)`,
			})
			.from(rptFeeReminders);

		const total = Number(countResult[0]?.total || 0);

		// 查询列表数据
		const data = await useDb(event)
			.select({
				id: rptFeeReminders.id,
				ownerInfo: rptFeeReminders.ownerInfo,
				outstandingAmount: rptFeeReminders.outstandingAmount,
				reminderMethod: rptFeeReminders.reminderMethod,
				reminderTime: rptFeeReminders.reminderTime,
				isDelivered: rptFeeReminders.isDelivered,
				ownerFeedback: rptFeeReminders.ownerFeedback,
				remark: rptFeeReminders.remark,
				createTime: rptFeeReminders.createTime,
				updateTime: rptFeeReminders.updateTime,
			})
			.from(rptFeeReminders)
			.orderBy(desc(rptFeeReminders.createTime))
			.limit(query.pageSize)
			.offset(offset);

		// 映射数据
		const list: FeeReminderListItem[] = data.map((item) => ({
			id: item.id || "",
			name: item.ownerInfo || "",
			status: item.isDelivered ? "已送达" : "未送达",
			createTime: formatDateTime(item.createTime),
			updateTime: formatDateTime(item.updateTime),
			remark: item.remark || "",
		}));

		const totalPages = Math.ceil(total / query.pageSize);

		const response: JsonVO<PageDTO<FeeReminderListItem>> = {
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
		console.error("[Fee Reminder List] Error:", error);
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
