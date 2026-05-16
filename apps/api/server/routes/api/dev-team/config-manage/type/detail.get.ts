import { defineHandler, getQuery } from "nitro/h3";
import { getDevRuntime } from "../../../../../modules/dev/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";

export default defineHandler(async (event) => {
	try {
		const query = getQuery(event);
		const runtime = getDevRuntime(event);
		return await runtime.adminAdapter.getDictionaryTypeDetail(query as { id?: string });
	} catch (error: any) {
		return adminFailure(error.message || "查询失败");
	}
});
