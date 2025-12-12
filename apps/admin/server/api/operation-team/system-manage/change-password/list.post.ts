/**
 * @file 修改密码记录列表接口
 * @description Change password record list API
 */

/** 获取修改密码记录列表 POST /api/operation-team/system-manage/change-password/list */
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ChangePasswordRecordListItem, ChangePasswordRecordQueryParams } from "@01s-11comm/type";
import { mockChangePasswordRecordData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ChangePasswordRecordListItem>>> => {
	const body = await readBody<ChangePasswordRecordQueryParams>(event);
	const {
		pageIndex = 1,
		pageSize = 10,
		username,
		realName,
		userRole,
		department,
		changeMethod,
		status,
		success,
		startTime,
		endTime,
	} = body ?? {};

	/** 数据筛选 */
	let filteredData = [...mockChangePasswordRecordData];

	if (username) {
		filteredData = filteredData.filter((item) => item.username.toLowerCase().includes(username.toLowerCase()));
	}
	if (realName) {
		filteredData = filteredData.filter((item) => item.realName.toLowerCase().includes(realName.toLowerCase()));
	}
	if (userRole) {
		filteredData = filteredData.filter((item) => item.userRole === userRole);
	}
	if (department) {
		filteredData = filteredData.filter((item) => item.department === department);
	}
	if (changeMethod) {
		filteredData = filteredData.filter((item) => item.changeMethod === changeMethod);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}
	if (success) {
		filteredData = filteredData.filter((item) => item.success === success);
	}
	if (startTime && endTime) {
		const start = new Date(startTime).getTime();
		const end = new Date(endTime).getTime();
		filteredData = filteredData.filter((item) => {
			const itemTime = new Date(item.changeTime).getTime();
			return itemTime >= start && itemTime <= end;
		});
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<ChangePasswordRecordListItem>> = {
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
	};

	return response;
});
