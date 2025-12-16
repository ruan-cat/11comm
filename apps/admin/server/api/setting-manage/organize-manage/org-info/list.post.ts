/**
 * @file 组织管理-组织信息-员工列表接口
 * @description Organization info employee list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, Employee, EmployeeListQuery } from "@01s-11comm/type";
import { mockEmployeeData } from "./mock-data";

export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<Employee>>> => {
	const body = await readBody<EmployeeListQuery>(event);
	const { pageIndex = 1, pageSize = 10, employeeName, orgId } = body ?? {};

	let filteredData = [...mockEmployeeData];

	if (employeeName) {
		filteredData = filteredData.filter((item) => item.name.includes(employeeName));
	}

	if (orgId) {
		// 简单的模拟：只匹配当前组织，实际可能需要匹配子组织
		filteredData = filteredData.filter((item) => item.orgId === orgId);
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
