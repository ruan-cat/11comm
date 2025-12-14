import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { PaymentReviewListItem, PaymentReviewQueryParams } from "@01s-11comm/type";
import { mockPaymentReviewData } from "./mock-data";

/**
 * @description payment-review列表 POST API
 * PaymentReview list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<PaymentReviewListItem>>> => {
	const body = await readBody<PaymentReviewQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, house, expenseItem, auditStatus, paymentStartTime, paymentEndTime, status } = body;

	let filteredData = [...mockPaymentReviewData];

	// 数据筛选
	if (house) {
		filteredData = filteredData.filter((item) => item.house.includes(house));
	}
	if (expenseItem) {
		filteredData = filteredData.filter((item) => item.expenseItem === expenseItem);
	}
	if (auditStatus) {
		filteredData = filteredData.filter((item) => item.auditStatus === auditStatus);
	}
	if (paymentStartTime && paymentEndTime) {
		filteredData = filteredData.filter((item) => {
			const itemTime = new Date(item.paymentTime).getTime();
			const start = new Date(paymentStartTime).getTime();
			const end = new Date(paymentEndTime).getTime();
			return itemTime >= start && itemTime <= end;
		});
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}

	// 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 返回标准格式
	return {
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
		timestamp: Date.now(),
	};
});
