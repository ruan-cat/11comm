/**
 * @file 组织管理-数据权限-列表接口
 * @description Data permission list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, DataPermission, DataPermissionListQuery } from "@01s-11comm/type";
import { mockDataPermissionData } from "./mock-data";

export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<DataPermission>>> => {
	const body = await readBody<DataPermissionListQuery>(event);
	const { pageIndex = 1, pageSize = 10, name } = body ?? {};

	let filteredData = [...mockDataPermissionData];

	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
	}

	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const list = filteredData.slice(startIndex, startIndex + pageSize);

	return {
		code: 200,
		message: "success",
		success: true,
		data: {
			list,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};
});
