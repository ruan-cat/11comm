import { defineHandler, readBody } from "nitro/h3";
import { getContractRuntime } from "../../../../../modules/contract/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const runtime = getContractRuntime(event);
		return await runtime.adminAdapter.uploadStatus(body || {});
	} catch (error: any) {
		return adminFailure(error.message || "查询上传状态失败");
	}
});
