/**
 * @file 合同附件列表接口
 * @description Attachment list API
 */

import { defineEventHandler, readBody } from "h3";
import type { JsonVO, PageDTO, AttachmentListItem, AttachmentQueryParams } from "@01s-11comm/type";
import { mockAttachmentData } from "./mock-data";

/**
 * 合同附件列表 POST API
 * Attachment list POST API
 */
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<AttachmentListItem>>> => {
	const body = await readBody<AttachmentQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, attachmentName, contractNumber, contractName, attachmentType, status } = body;

	let filteredData = [...mockAttachmentData];

	/** 数据筛选 */
	if (attachmentName) {
		filteredData = filteredData.filter((item) => item.attachmentName.includes(attachmentName));
	}
	if (contractNumber) {
		filteredData = filteredData.filter((item) => item.contractNumber.includes(contractNumber));
	}
	if (contractName) {
		filteredData = filteredData.filter((item) => item.contractName.includes(contractName));
	}
	if (attachmentType) {
		filteredData = filteredData.filter((item) => item.attachmentType === attachmentType);
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
