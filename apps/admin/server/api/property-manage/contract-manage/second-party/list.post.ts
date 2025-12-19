/**
 * @file 合同乙方列表接口
 * @description Second party list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, SecondPartyListItem, SecondPartyQueryParams } from "@01s-11comm/type";
import { mockSecondPartyData } from "./mock-data";

/**
 * 合同乙方列表 POST API
 * Second party list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<SecondPartyListItem>>> => {
	const body = await readBody<SecondPartyQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, partyB, contactPerson, contactPhone, legalRepresentative, status } = body;

	let filteredData = [...mockSecondPartyData];

	/** 数据筛选 */
	if (partyB) {
		filteredData = filteredData.filter((item) => item.partyB.includes(partyB));
	}
	if (contactPerson) {
		filteredData = filteredData.filter((item) => item.contactPerson.includes(contactPerson));
	}
	if (contactPhone) {
		filteredData = filteredData.filter((item) => item.contactPhone.includes(contactPhone));
	}
	if (legalRepresentative) {
		filteredData = filteredData.filter((item) => item.legalRepresentative.includes(legalRepresentative));
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
