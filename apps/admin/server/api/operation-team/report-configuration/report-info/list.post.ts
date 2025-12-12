import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { ReportInfoListItem, ReportInfoQueryParams } from "@01s-11comm/type/business/operation-team/report-configuration/report-info";
import { mockReportInfoData } from "./mock-data";

/**
 * @description 报表信息列表 POST API
 * Report info list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ReportInfoListItem>>> => {
	const body = await readBody<ReportInfoQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, reportId, reportGroup, optionTitle } = body;

	let filteredData = [...mockReportInfoData];

	// 数据筛选
	if (reportId) {
		filteredData = filteredData.filter((item) => item.reportId.includes(reportId));
	}
	if (reportGroup) {
		filteredData = filteredData.filter((item) => item.reportGroup.includes(reportGroup));
	}
	if (optionTitle) {
		filteredData = filteredData.filter((item) => item.optionTitle.includes(optionTitle));
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

