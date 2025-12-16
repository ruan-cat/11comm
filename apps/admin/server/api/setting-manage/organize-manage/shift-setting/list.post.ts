/**
 * @file 组织管理-班次设置-列表接口
 * @description Shift setting list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, ShiftSetting, ShiftSettingListQuery } from "@01s-11comm/type";
import { mockShiftSettingData } from "./mock-data";

export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ShiftSetting>>> => {
	const body = await readBody<ShiftSettingListQuery>(event);
	const { pageIndex = 1, pageSize = 10, name, type } = body ?? {};

	let filteredData = [...mockShiftSettingData];

	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
	}

	if (type) {
		filteredData = filteredData.filter((item) => item.type === type);
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
