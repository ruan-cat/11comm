import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { TypeListItem, TypeQueryParams } from "@01s-11comm/type";
import { mockTypeData } from "./mock-data";

/**
 * @description type列表 POST API
 * Type list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<TypeListItem>>> => {
	const body = await readBody<TypeQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, typeName, isAudit, status } = body;

	let filteredData = [...mockTypeData];

	// 数据筛选
	if (typeName) {
		filteredData = filteredData.filter((item) => item.typeName.includes(typeName));
	}
	if (isAudit) {
		filteredData = filteredData.filter((item) => item.isAudit === isAudit);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
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
