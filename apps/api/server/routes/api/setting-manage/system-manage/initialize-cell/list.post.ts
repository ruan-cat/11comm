import { defineHandler, readBody } from "nitro/h3";
import { getSettingRuntime } from "../../../../../modules/setting/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";

export default defineHandler(async (event) => {
	try {
		const body = await readBody(event);
		const runtime = getSettingRuntime(event);
		return await runtime.adminAdapter.listInitializeCell(body || {});
	} catch (error: any) {
		return adminFailure(error.message || "查询失败");
	}
});
