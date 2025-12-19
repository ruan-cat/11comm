import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { PropertyRegisterListItem, PropertyRegisterQueryParams } from "@01s-11comm/type";
import { mockPropertyRegisterData } from "./mock-data";

/**
 * @description property-register列表 POST API
 * PropertyRegister list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<PropertyRegisterListItem>>> => {
	const body = await readBody<PropertyRegisterQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, houseId, houseNumber, ownerName, contactInfo, idCardNumber, address, status } = body;

	let filteredData = [...mockPropertyRegisterData];

	// 数据筛选
	if (houseId) {
		filteredData = filteredData.filter((item) => item.houseId.includes(houseId));
	}
	if (houseNumber) {
		filteredData = filteredData.filter((item) => item.houseNumber.includes(houseNumber));
	}
	if (ownerName) {
		filteredData = filteredData.filter((item) => item.ownerName.includes(ownerName));
	}
	if (contactInfo) {
		filteredData = filteredData.filter((item) => item.contactInfo.includes(contactInfo));
	}
	if (idCardNumber) {
		filteredData = filteredData.filter((item) => item.idCardNumber.includes(idCardNumber));
	}
	if (address) {
		filteredData = filteredData.filter((item) => item.address.includes(address));
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
