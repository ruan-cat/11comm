import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { OwnersCommitteeListItem, OwnersCommitteeQueryParams } from "@01s-11comm/type";
import { mockOwnersCommitteeData } from "./mock-data";

/**
 * @description owners-committee列表 POST API
 * OwnersCommittee list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<OwnersCommitteeListItem>>> => {
	const body = await readBody<OwnersCommitteeQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, name, status } = body;

	let filteredData = [...mockOwnersCommitteeData];

	// 数据筛选
	if (name) {
		filteredData = filteredData.filter((item) => item.name.includes(name));
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
