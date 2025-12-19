import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { RepairReportsSummaryTableListItem, RepairReportsSummaryTableQueryParams } from "@01s-11comm/type";
import { mockRepairReportsSummaryTableData } from "./mock-data";

/**
 * @description 报修汇总表列表 POST API
 * Repair reports summary table list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<RepairReportsSummaryTableListItem>>> => {
	const body = await readBody<RepairReportsSummaryTableQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, repairType, repairStatus, urgencyLevel, community, statisticsStartTime, statisticsEndTime } = body;

	let filteredData = [...mockRepairReportsSummaryTableData];

	// 数据筛选
	if (repairType) {
		filteredData = filteredData.filter((item) => item.repairType === repairType);
	}

	if (community) {
		filteredData = filteredData.filter((item) => item.community === community);
	}

	if (statisticsStartTime && statisticsEndTime) {
		filteredData = filteredData.filter((item) => {
			const itemTime = new Date(item.statisticsTime).getTime();
			const startTime = new Date(statisticsStartTime).getTime();
			const endTime = new Date(statisticsEndTime).getTime();
			return itemTime >= startTime && itemTime <= endTime;
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
