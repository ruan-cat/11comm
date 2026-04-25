import { defineHandler, readBody } from "nitro/h3";
import { getFeeRuntime } from "../../../../../modules/fee/runtime";

export default defineHandler(async (event) => {
	const body = (await readBody(event)) as Record<string, unknown>;
	const { adminAdapter } = getFeeRuntime(event);

	return adminAdapter.listHouseCharges({
		page: Number(body.page || body.pageIndex || 1),
		pageIndex: Number(body.pageIndex || body.page || 1),
		pageSize: Number(body.pageSize || 20),
		expenseItem: asOptionalString(body.expenseItem),
		billingPeriod: asOptionalString(body.billingPeriod),
		status: asOptionalString(body.status),
	});
});

function asOptionalString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
