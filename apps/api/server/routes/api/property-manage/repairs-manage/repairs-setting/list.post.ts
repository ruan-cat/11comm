import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getRepairRuntime } from "../../../../../modules/repair/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getRepairRuntime(event);

		return await adminAdapter.listRepairsSettings({
			page: Number(body.page || body.pageIndex || 1),
			pageIndex: Number(body.pageIndex || body.page || 1),
			pageSize: Number(body.pageSize || 20),
			publicArea: toOptionalTrimmedString(body.publicArea),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
