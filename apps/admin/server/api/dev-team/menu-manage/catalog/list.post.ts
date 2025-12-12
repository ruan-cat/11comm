import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, MenuCatalogListItem, MenuCatalogQueryParams } from "@01s-11comm/type";
import { mockMenuCatalogData } from "./mock-data";

/**
 * @description 菜单目录列表 POST API
 * Menu catalog list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<MenuCatalogListItem>>> => {
	const body = await readBody<MenuCatalogQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, name, storeType, groupType } = body;

	let filteredData = [...mockMenuCatalogData];

	// 数据筛选
	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
	}
	if (storeType) {
		filteredData = filteredData.filter((item) => item.storeType === storeType);
	}
	if (groupType) {
		filteredData = filteredData.filter((item) => item.groupType === groupType);
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
