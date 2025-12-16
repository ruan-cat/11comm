/**
 * @file 组织管理-排班设置-列表接口
 * @description Scheduling setting list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, SchedulingSetting, SchedulingSettingListQuery } from "@01s-11comm/type";
import { mockSchedulingSettingData } from "./mock-data";

export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<SchedulingSetting>>> => {
	const body = await readBody<SchedulingSettingListQuery>(event);
	const { pageIndex = 1, pageSize = 10, name, status } = body ?? {};

	let filteredData = [...mockSchedulingSettingData];

	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
	}

	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
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
