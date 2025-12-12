import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { MerchantAdminListItem, MerchantAdminQueryParams } from "@01s-11comm/type/business/operation-team/merchant-manage/merchant-admin";
import { mockMerchantAdminData } from "./mock-data";

/**
 * @description 商户管理员列表 POST API
 * Merchant admin list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<MerchantAdminListItem>>> => {
	const body = await readBody<MerchantAdminQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, propertyName, adminName, contactPhone, status } = body;

	let filteredData = [...mockMerchantAdminData];

	// 数据筛选
	if (propertyName) {
		filteredData = filteredData.filter((item) => item.propertyName.includes(propertyName));
	}
	if (adminName) {
		filteredData = filteredData.filter((item) => item.adminName.includes(adminName));
	}
	if (contactPhone) {
		filteredData = filteredData.filter((item) => item.adminPhone.includes(contactPhone));
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

