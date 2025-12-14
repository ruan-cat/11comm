import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { OverduePaymentInformationListItem, OverduePaymentInformationQueryParams } from "@01s-11comm/type";
import { mockOverduePaymentInformationData } from "./mock-data";

/**
 * @description overdue-payment-information列表 POST API
 * OverduePaymentInformation list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<OverduePaymentInformationListItem>>> => {
	const body = await readBody<OverduePaymentInformationQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, chargeObject, ownerName, phoneNumber, startTime, endTime, status } = body;

	let filteredData = [...mockOverduePaymentInformationData];

	// 数据筛选
	if (chargeObject) {
		filteredData = filteredData.filter((item) => item.chargeObject === chargeObject);
	}
	if (ownerName) {
		filteredData = filteredData.filter((item) => item.ownerName.includes(ownerName));
	}
	if (phoneNumber) {
		filteredData = filteredData.filter((item) => item.phoneNumber.includes(phoneNumber));
	}
	if (startTime && endTime) {
		filteredData = filteredData.filter((item) => {
			const itemStartTime = new Date(item.startTime).getTime();
			const itemEndTime = new Date(item.endTime).getTime();
			const start = new Date(startTime).getTime();
			const end = new Date(endTime).getTime();
			// 简单的重叠判断或者包含判断，这里假设是查询范围内的记录
			// 实际上业务逻辑可能更复杂，这里简单处理为开始时间在范围内
			return itemStartTime >= start && itemEndTime <= end;
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
