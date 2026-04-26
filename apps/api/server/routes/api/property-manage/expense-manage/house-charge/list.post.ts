import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getFeeRuntime } from "../../../../../modules/fee/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getFeeRuntime(event);

		return await adminAdapter.listHouseCharges({
			page: Number(body.page || body.pageIndex || 1),
			pageIndex: Number(body.pageIndex || body.page || 1),
			pageSize: Number(body.pageSize || 20),
			expenseItem: toOptionalTrimmedString(body.expenseItem),
			billingPeriod: toOptionalTrimmedString(body.billingPeriod),
			status: toOptionalTrimmedString(body.status),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
