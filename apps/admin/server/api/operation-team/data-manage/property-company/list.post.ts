import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { PropertyCompanyListItem, PropertyCompanyQueryParams } from "@01s-11comm/type/business/operation-team/data-manage/property-company";
import { mockPropertyCompanyData } from "./mock-data";

/**
 * @description 物业公司列表 POST API
 * Property company list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<PropertyCompanyListItem>>> => {
	const body = await readBody<PropertyCompanyQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, companyId, companyName, phone } = body;

	let filteredData = [...mockPropertyCompanyData];

	// 数据筛选
	if (companyId) {
		filteredData = filteredData.filter((item) => item.companyId.includes(companyId));
	}
	if (companyName) {
		filteredData = filteredData.filter((item) => item.companyName.includes(companyName));
	}
	if (phone) {
		filteredData = filteredData.filter((item) => item.phone.includes(phone));
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

