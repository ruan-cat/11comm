import { defineHandler, readBody } from "nitro/h3";
import { getContractRuntime } from "../../../../../modules/contract/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const runtime = getContractRuntime(event);
		return await runtime.adminAdapter.deleteDraftContract(body as { id?: string });
	} catch (error: any) {
		return adminFailure(error.message || "删除失败");
	}
});
