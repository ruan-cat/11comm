import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getHouseRuntime } from "../../../../../modules/house/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getHouseRuntime(event);

		return await adminAdapter.listInvoices({
			pageIndex: Number(body.pageIndex ?? body.page ?? 1),
			pageSize: Number(body.pageSize ?? 20),
			invoiceNo: toOptionalTrimmedString(body.invoiceNo),
			invoiceType: toOptionalTrimmedString(body.invoiceType),
			ownerName: toOptionalTrimmedString(body.ownerName),
			auditStatus: toOptionalTrimmedString(body.auditStatus),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
