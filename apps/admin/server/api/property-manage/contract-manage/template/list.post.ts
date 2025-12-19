/**
 * @file 合同模板列表接口
 * @description Template list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, TemplateListItem, TemplateQueryParams } from "@01s-11comm/type";
import { mockTemplateData } from "./mock-data";

/**
 * 合同模板列表 POST API
 * Template list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<TemplateListItem>>> => {
	const body = await readBody<TemplateQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, templateName, templateNumber, applicableContractType, status } = body;

	let filteredData = [...mockTemplateData];

	/** 数据筛选 */
	if (templateName) {
		filteredData = filteredData.filter((item) => item.templateName.includes(templateName));
	}
	if (templateNumber) {
		filteredData = filteredData.filter((item) => item.templateNumber.includes(templateNumber));
	}
	if (applicableContractType) {
		filteredData = filteredData.filter((item) => item.applicableContractType === applicableContractType);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
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
