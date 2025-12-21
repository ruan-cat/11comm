/**
 * @file 组织管理-数据权限-列表接口
 * @description Data permission list API
 * POST /api/setting-manage/organize-manage/data-permission/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, DataPermission, DataPermissionListQuery } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockDataPermissionData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<DataPermission>>> => {
	// 1. 读取请求参数
	const body = await readBody<DataPermissionListQuery>(event);
	const defaultParams: DataPermissionListQuery = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选 - 使用通用筛选工具函数
	const filteredData = filterDataByQuery(mockDataPermissionData, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式 - 必须要用完整的对象来约束返回的数据格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<DataPermission>> = {
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
