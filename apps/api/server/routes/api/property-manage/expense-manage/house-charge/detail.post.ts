import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const adminAdapter = await resolveAdminAdapter(event);

		return await adminAdapter.getHouseChargeDetail({
			id: toOptionalTrimmedString(body.id),
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
