import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ChangePasswordRecord, ChangePasswordRecordListQuery } from "@01s-11comm/type";
import { mockChangePasswordRecordData } from "./mock-data";

/**
 * @description 密码修改记录列表 POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ChangePasswordRecord>>> => {
	const body = await readBody<ChangePasswordRecordListQuery>(event);
	const {
		pageIndex = 1,
		pageSize = 10,
		username,
		realName,
		department,
		changeTime,
		changeType,
		status,
		changeTimeRange,
	} = body;

	let filteredData = [...mockChangePasswordRecordData];

	// 数据筛选
	if (username) {
		filteredData = filteredData.filter((item) => item.username.includes(username));
	}
	if (realName) {
		filteredData = filteredData.filter((item) => item.realName.includes(realName));
	}
	if (department) {
		filteredData = filteredData.filter((item) => item.department === department);
	}
	if (changeTime) {
		filteredData = filteredData.filter((item) => item.changeTime.includes(changeTime));
	}
	if (changeType) {
		filteredData = filteredData.filter((item) => item.changeType === changeType);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}
	if (changeTimeRange && changeTimeRange[0] && changeTimeRange[1]) {
		const startTime = new Date(changeTimeRange[0]).getTime();
		const endTime = new Date(changeTimeRange[1]).getTime();
		filteredData = filteredData.filter((item) => {
			const time = new Date(item.changeTime).getTime();
			return time >= startTime && time <= endTime;
		});
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
