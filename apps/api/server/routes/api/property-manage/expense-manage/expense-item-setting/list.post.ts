import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const adminAdapter = await resolveAdminAdapter(event);

		return await adminAdapter.listExpenseItemSettings({
			page: Number(body.page || body.pageIndex || 1),
			pageIndex: Number(body.pageIndex || body.page || 1),
			pageSize: Number(body.pageSize || 20),
			code: toOptionalTrimmedString(body.code),
			expenseItem: toOptionalTrimmedString(body.expenseItem),
			expenseIdentifier: toOptionalTrimmedString(body.expenseIdentifier),
			paymentType: toOptionalTrimmedString(body.paymentType),
			accountDeduction: toOptionalTrimmedString(body.accountDeduction),
			status: toOptionalTrimmedString(body.status),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});

async function resolveAdminAdapter(event: any) {
	if (event?.context?.feeRuntime?.adminAdapter) {
		return event.context.feeRuntime.adminAdapter;
	}

	const { getFeeRuntime } = await import("../../../../../modules/fee/runtime");
	return getFeeRuntime(event).adminAdapter;
}
