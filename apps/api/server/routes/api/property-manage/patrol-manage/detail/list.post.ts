import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getPatrolRuntime } from "../../../../../modules/patrol/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getPatrolRuntime(event);

		return await adminAdapter.listPatrolDetails({
			pageIndex: Number(body.pageIndex ?? body.page ?? 1),
			pageSize: Number(body.pageSize ?? 20),
			taskStatus: toOptionalTrimmedString(body.taskStatus),
			patrolMethod: toOptionalTrimmedString(body.patrolMethod),
			sortBy: toPatrolDetailSortBy(body.sortBy),
			sortOrder: toSortOrder(body.sortOrder),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});

function toPatrolDetailSortBy(value: unknown): "createTime" | "updateTime" | undefined {
	return value === "createTime" || value === "updateTime" ? value : undefined;
}

function toSortOrder(value: unknown): "asc" | "desc" | undefined {
	return value === "asc" || value === "desc" ? value : undefined;
}
