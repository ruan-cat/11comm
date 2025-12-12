import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { MerchantInfoListItem, MerchantInfoQueryParams } from "@01s-11comm/type/business/operation-team/merchant-manage/merchant-info";
import { mockMerchantInfoData } from "./mock-data";

/**
 * @description 商户信息列表 POST API
 * Merchant info list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<MerchantInfoListItem>>> => {
	const body = await readBody<MerchantInfoQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, merchantName, merchantType, contactPhone, businessStatus, affiliatedCommunity } = body;

	let filteredData = [...mockMerchantInfoData];

	// 数据筛选
	if (merchantName) {
		filteredData = filteredData.filter((item) => item.merchantName.includes(merchantName));
	}
	if (merchantType) {
		filteredData = filteredData.filter((item) => item.merchantType === merchantType);
	}
	if (contactPhone) {
		filteredData = filteredData.filter((item) => item.contactPhone.includes(contactPhone));
	}
	if (businessStatus) {
		filteredData = filteredData.filter((item) => item.businessStatus === businessStatus);
	}
	if (affiliatedCommunity) {
		filteredData = filteredData.filter((item) => item.affiliatedCommunity.includes(affiliatedCommunity));
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

