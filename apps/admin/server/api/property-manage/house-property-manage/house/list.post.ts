import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { HouseListItem, HouseQueryParams } from "@01s-11comm/type";
import { mockHouseData } from "./mock-data";

/**
 * @description 房屋管理列表 POST API
 * House list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<HouseListItem>>> => {
	const body = await readBody<HouseQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, houseCode, houseStatus, houseType } = body;

	let filteredData = [...mockHouseData];

	// 数据筛选
	if (houseCode) {
		filteredData = filteredData.filter((item) => item.houseCode.includes(houseCode));
	}
	if (houseStatus) {
		filteredData = filteredData.filter((item) => item.houseStatus === houseStatus);
	}
	if (houseType) {
		filteredData = filteredData.filter((item) => item.houseType === houseType);
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

