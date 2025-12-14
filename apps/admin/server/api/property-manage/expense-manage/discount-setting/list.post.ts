import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { DiscountSettingListItem, DiscountSettingQueryParams } from "@01s-11comm/type";
import { mockDiscountSettingData } from "./mock-data";

/**
 * @description discount-setting列表 POST API
 * DiscountSetting list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<DiscountSettingListItem>>> => {
	const body = await readBody<DiscountSettingQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, discountId, discountName, discountType, ruleName, status } = body;

	let filteredData = [...mockDiscountSettingData];

	// 数据筛选
	if (discountId) {
		filteredData = filteredData.filter((item) => item.discountId.includes(discountId));
	}
	if (discountName) {
		filteredData = filteredData.filter((item) => item.discountName.includes(discountName));
	}
	if (discountType) {
		filteredData = filteredData.filter((item) => item.discountType === discountType);
	}
	if (ruleName) {
		filteredData = filteredData.filter((item) => item.ruleName.includes(ruleName));
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
