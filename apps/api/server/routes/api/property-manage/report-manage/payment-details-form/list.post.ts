import { defineHandler, readBody } from "nitro/h3";
import { getFeeRuntime } from "../../../../../modules/fee/runtime";

export default defineHandler(async (event) => {
	const body = (await readBody(event)) as Record<string, unknown>;
	const { adminAdapter } = getFeeRuntime(event);

	return adminAdapter.listPaymentDetailsForm({
		pageIndex: Number(body.pageIndex || 1),
		pageSize: Number(body.pageSize || 20),
		name: asOptionalString(body.name),
		status: asOptionalString(body.status),
	});
});

function asOptionalString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
