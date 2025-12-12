import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { MenuGroupListItem, MenuGroupQueryParams } from "@01s-11comm/type";
import { mockMenuGroupData } from "./mock-data";

/**
 * @description 菜单组列表 POST API
 * Menu group list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<MenuGroupListItem>>> => {
	const body = await readBody<MenuGroupQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, groupId, groupName, groupCode, status } = body;

	let filteredData = [...mockMenuGroupData];

	// 数据筛选
	if (groupId) {
		filteredData = filteredData.filter((item) => item.groupId.includes(groupId));
	}
	if (groupName) {
		filteredData = filteredData.filter((item) => item.groupName.includes(groupName));
	}
	if (groupCode) {
		filteredData = filteredData.filter((item) => item.groupCode.includes(groupCode));
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
