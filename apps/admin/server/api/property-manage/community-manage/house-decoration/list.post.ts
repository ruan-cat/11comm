/**
 * @file 房屋装修列表接口
 * @description House decoration list API
 */

/** 获取房屋装修列表 POST /api/property-manage/community-manage/house-decoration/list */
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, HouseDecorationListItem, HouseDecorationQueryParams } from "@01s-11comm/type";
import { mockHouseDecorationData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<HouseDecorationListItem>>> => {
	const body = await readBody<HouseDecorationQueryParams>(event);
	const {
		pageIndex = 1,
		pageSize = 10,
		houseNumber,
		contactName,
		contactPhone,
		status,
		isDelayed,
		decorationTime,
		applicationStartTime,
		applicationEndTime,
	} = body ?? {};

	/** 数据筛选 */
	let filteredData = [...mockHouseDecorationData];

	if (houseNumber) {
		filteredData = filteredData.filter((item) => item.houseNumber.toLowerCase().includes(houseNumber.toLowerCase()));
	}
	if (contactName) {
		filteredData = filteredData.filter((item) => item.contactName.toLowerCase().includes(contactName.toLowerCase()));
	}
	if (contactPhone) {
		filteredData = filteredData.filter((item) => item.contactPhone.toLowerCase().includes(contactPhone.toLowerCase()));
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}
	if (isDelayed) {
		filteredData = filteredData.filter((item) => item.isDelayed === isDelayed);
	}
	if (decorationTime) {
		filteredData = filteredData.filter((item) => item.decorationTime.includes(decorationTime));
	}
	if (applicationStartTime && applicationEndTime) {
		const start = new Date(applicationStartTime).getTime();
		const end = new Date(applicationEndTime).getTime();
		filteredData = filteredData.filter((item) => {
			const itemTime = new Date(item.applicationTime).getTime();
			return itemTime >= start && itemTime <= end;
		});
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<HouseDecorationListItem>> = {
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
