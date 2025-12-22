/**
 * @file 欠费明细表列表接口
 * @description Arrears details list API
 * POST /api/property-manage/report-manage/arrears-details-list/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ArrearsDetailsListItem, ArrearsDetailsListQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockArrearsDetailsListData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ArrearsDetailsListItem>>> => {
	/** 读取请求参数 */
	const body = await readBody<ArrearsDetailsListQueryParams>(event);
	const defaultParams: ArrearsDetailsListQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, 费用编号, 房号, 开始时间, 结束时间, community, 业主 } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockArrearsDetailsListData, {
		费用编号,
		房号,
		开始时间,
		结束时间,
		community,
		业主,
	});

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<ArrearsDetailsListItem>> = {
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
