import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { NoChargeHouseListItem, NoChargeHouseQueryParams } from "@01s-11comm/type";
import { mockNoChargeHouseData } from "./mock-data";

/**
 * @description no-charge-house列表 POST API
 * NoChargeHouse list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<NoChargeHouseListItem>>> => {
	const body = await readBody<NoChargeHouseQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, name, status } = body;

	let filteredData = [...mockNoChargeHouseData];

	// 数据筛选
	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
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
