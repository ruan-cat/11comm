/**
 * @file 组织管理-员工信息-员工列表接口
 * @description Staff info list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, StaffInfo, StaffInfoListQuery } from "@01s-11comm/type";
import { mockStaffInfoData } from "./mock-data";

export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<StaffInfo>>> => {
	const body = await readBody<StaffInfoListQuery>(event);
	const { pageIndex = 1, pageSize = 10, id, name, phone } = body ?? {};

	let filteredData = [...mockStaffInfoData];

	if (id) {
		filteredData = filteredData.filter((item) => item.employeeNumber.toLowerCase().includes(id.toLowerCase()));
	}
	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
	}
	if (phone) {
		filteredData = filteredData.filter((item) => item.phone.includes(phone));
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
