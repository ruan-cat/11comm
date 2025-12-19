import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type { InvoiceTitleListItem, InvoiceTitleQueryParams } from "@01s-11comm/type";
import { mockInvoiceTitleData } from "./mock-data";

/**
 * @description invoice-title列表 POST API
 * InvoiceTitle list POST API
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<InvoiceTitleListItem>>> => {
	const body = await readBody<InvoiceTitleQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, ownerName, invoiceType } = body;

	let filteredData = [...mockInvoiceTitleData];

	// 数据筛选
	if (ownerName) {
		filteredData = filteredData.filter((item) => item.ownerName.includes(ownerName));
	}
	if (invoiceType) {
		filteredData = filteredData.filter((item) => item.invoiceType === invoiceType);
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
