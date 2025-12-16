/**
 * @file 组织管理-排班表-列表接口
 * @description Working schedule list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, WorkingSchedule, WorkingScheduleListQuery } from "@01s-11comm/type";
import { mockWorkingScheduleData } from "./mock-data";

export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<WorkingSchedule>>> => {
	const body = await readBody<WorkingScheduleListQuery>(event);
	const { pageIndex = 1, pageSize = 10, name, type } = body ?? {};

	let filteredData = [...mockWorkingScheduleData];

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
