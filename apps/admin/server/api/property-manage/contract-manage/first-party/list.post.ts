import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { FirstPartyListItem, FirstPartyQueryParams } from "@01s-11comm/type";
import { mockFirstPartyData } from "./mock-data";

/**
 * @description first-party列表 POST API
 * FirstParty list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<FirstPartyListItem>>> => {
	const body = await readBody<FirstPartyQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, partyA, contactPerson, contactPhone, legalRepresentative, status } = body;

	let filteredData = [...mockFirstPartyData];

	// 数据筛选
	if (partyA) {
		filteredData = filteredData.filter((item) => item.partyA.includes(partyA));
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
