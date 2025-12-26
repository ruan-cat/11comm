/**
 * @file Owner Information 列表接口
 * @description Owner Information list API
 * POST /api/property-manage/house-property-manage/owner-information/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, OwnerInformationListItem, OwnerInformationQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockOwnerInformationData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<OwnerInformationListItem>>> => {
	const body = await readBody<OwnerInformationQueryParams>(event);
	const defaultParams: OwnerInformationQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, personType, ownerName, houseNo, phone, idCard } = mergedParams;

	/** 数据筛选 - 由于查询参数与列表字段不完全匹配，需自定义筛选 */
	let filteredData = [...mockOwnerInformationData];

	/** 根据名称筛选 (ownerName 对应 name 字段) */
	if (ownerName) {
		filteredData = filteredData.filter((item) => item.name?.includes(ownerName));
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<OwnerInformationListItem>> = {
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
