import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getPatrolRuntime } from "../../../../../modules/patrol/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getPatrolRuntime(event);

		return await adminAdapter.listPatrolPaths({
			pageIndex: Number(body.pageIndex ?? body.page ?? 1),
			pageSize: Number(body.pageSize ?? 20),
			pathName: toOptionalTrimmedString(body.pathName),
			planId: toOptionalTrimmedString(body.planId),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});
