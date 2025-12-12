import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { MenuItemListItem, MenuItemQueryParams } from "@01s-11comm/type";
import { mockMenuItemData } from "./mock-data";

/**
 * @description 菜单项列表 POST API
 * Menu item list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<MenuItemListItem>>> => {
	const body = await readBody<MenuItemQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, menuId, menuName, parentMenu, menuType, status, isExternal, isCached, isHidden } = body;

	let filteredData = [...mockMenuItemData];

	// 数据筛选
	if (menuId) {
		filteredData = filteredData.filter((item) => item.menuId.includes(menuId));
	}
	if (menuName) {
		filteredData = filteredData.filter((item) => item.menuName.includes(menuName));
	}
	if (parentMenu) {
		filteredData = filteredData.filter((item) => item.parentMenu.includes(parentMenu));
	}
	if (menuType) {
		filteredData = filteredData.filter((item) => item.menuType === menuType);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}
	if (isExternal) {
		filteredData = filteredData.filter((item) => item.isExternal === isExternal);
	}
	if (isCached) {
		filteredData = filteredData.filter((item) => item.isCached === isCached);
	}
	if (isHidden) {
		filteredData = filteredData.filter((item) => item.isHidden === isHidden);
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

