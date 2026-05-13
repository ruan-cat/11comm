import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getFeeRuntime } from "../../../../../modules/fee/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getFeeRuntime(event);

		return await adminAdapter.listOwnerPaymentDetails({
			pageIndex: Number(body.pageIndex || body.page || 1),
			pageSize: Number(body.pageSize || 20),
			houseNumberContractName: toOptionalTrimmedString(body.houseNumberContractName),
			ownerName: toOptionalTrimmedString(body.ownerName),
			ownerPhone: toOptionalTrimmedString(body.ownerPhone),
			feeCategory: toOptionalTrimmedString(body.feeCategory),
			feeItem: toOptionalTrimmedString(body.feeItem),
			community: toOptionalTrimmedString(body.community),
			year: toOptionalTrimmedString(body.year),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
