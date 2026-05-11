import { defineHandler, readBody } from "nitro/h3";
import { getDevRuntime } from "../../../../../modules/dev/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";

export default defineHandler(async (event) => {
	try {
		const body = await readBody(event);
		const runtime = getDevRuntime(event);
		return await runtime.adminAdapter.listDictionaryType(body || {});
	} catch (error: any) {
		return adminFailure(error.message || "查询失败");
	}
});
