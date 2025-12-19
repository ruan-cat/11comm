/**
 * @file 缴费审核列表接口
 * @description Payment review list API
 * @route POST /api/property-manage/expense-manage/payment-review/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, PaymentReviewListItem, PaymentReviewQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockPaymentReviewData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<PaymentReviewListItem>>> => {
	const body = await readBody<PaymentReviewQueryParams>(event);
	const defaultParams: PaymentReviewQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, paymentStartTime, paymentEndTime, ...filters } = mergedParams;

	/** 数据筛选 */
	let filteredData = filterDataByQuery(mockPaymentReviewData, filters);

	/** 处理日期范围筛选 */
	if (paymentStartTime && paymentEndTime) {
		filteredData = filteredData.filter((item) => {
			const itemTime = new Date(item.paymentTime).getTime();
			const start = new Date(paymentStartTime).getTime();
			const end = new Date(paymentEndTime).getTime();
			return itemTime >= start && itemTime <= end;
		});
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<PaymentReviewListItem>> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};

	return response;
});
