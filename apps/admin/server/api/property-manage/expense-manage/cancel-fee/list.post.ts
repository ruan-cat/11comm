import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { CancelFeeListItem, CancelFeeQueryParams } from "@01s-11comm/type";
import { mockCancelFeeData } from "./mock-data";

/**
 * @description cancel-fee列表 POST API
 * CancelFee list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<CancelFeeListItem>>> => {
	const body = await readBody<CancelFeeQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, batchNumber, employee, time, cancelReason, auditStatus } = body;

	let filteredData = [...mockCancelFeeData];

	// 数据筛选
	if (batchNumber) {
		filteredData = filteredData.filter((item) => item.batchNumber.includes(batchNumber));
	}
	if (employee) {
		filteredData = filteredData.filter((item) => item.employee.includes(employee));
	}
	if (time) {
		filteredData = filteredData.filter((item) => item.time.includes(time));
	}
	if (cancelReason) {
		filteredData = filteredData.filter((item) => item.cancelReason.includes(cancelReason));
	}
	if (auditStatus) {
		filteredData = filteredData.filter((item) => item.auditStatus === auditStatus);
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
