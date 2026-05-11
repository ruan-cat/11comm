import { defineHandler, readBody } from "nitro/h3";
import { getOperationRuntime } from "../../../../../modules/operation/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";

export default defineHandler(async (event) => {
	try {
		const body = await readBody(event);
		const runtime = getOperationRuntime(event);
		return await runtime.adminAdapter.listPropertyManagementCompany(body || {});
	} catch (error: any) {
		return adminFailure(error.message || "查询失败");
	}
});
