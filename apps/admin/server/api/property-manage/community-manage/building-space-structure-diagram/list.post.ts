/**
 * @file 楼栋结构图列表接口
 * @description Building space structure diagram list API
 */

/** 获取楼栋结构图列表 POST /api/property-manage/community-manage/building-space-structure-diagram/list */
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, BuildingSpaceStructureDiagramListItem, BuildingSpaceStructureDiagramQueryParams } from "@01s-11comm/type";
import { mockBuildingSpaceStructureDiagramData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<BuildingSpaceStructureDiagramListItem>>> => {
	const body = await readBody<BuildingSpaceStructureDiagramQueryParams>(event);
	const {
		pageIndex = 1,
		pageSize = 10,
		buildingId,
		buildingName,
		buildingStructure,
		status,
		constructionYear,
	} = body ?? {};

	/** 数据筛选 */
	let filteredData = [...mockBuildingSpaceStructureDiagramData];

	if (buildingId) {
		filteredData = filteredData.filter((item) => item.buildingId.toLowerCase().includes(buildingId.toLowerCase()));
	}
	if (buildingName) {
		filteredData = filteredData.filter((item) => item.buildingName.toLowerCase().includes(buildingName.toLowerCase()));
	}
	if (buildingStructure) {
		filteredData = filteredData.filter((item) => item.buildingStructure === buildingStructure);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}
	if (constructionYear) {
		filteredData = filteredData.filter((item) => item.constructionYear.includes(constructionYear));
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<BuildingSpaceStructureDiagramListItem>> = {
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
