/**
 * @file 组织管理-角色权限-列表接口
 * @description Role permission list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, RolePermission, RolePermissionListQuery } from "@01s-11comm/type";
import { mockRolePermissionData } from "./mock-data";

export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<RolePermission>>> => {
	const body = await readBody<RolePermissionListQuery>(event);
	const { pageIndex = 1, pageSize = 10, name, code } = body ?? {};

	let filteredData = [...mockRolePermissionData];

	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
	}

	if (code) {
		filteredData = filteredData.filter((item) => item.code.includes(code));
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
