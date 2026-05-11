import { defineHandler, readBody, setResponseStatus } from "nitro/h3";
import { getPatrolRuntime } from "../../../../../modules/patrol/runtime";
import { adminFailure } from "../../../../../shared/runtime/response-builder";
import { toOptionalTrimmedString } from "../../../../../utils/string";

export default defineHandler(async (event) => {
	try {
		const body = (await readBody(event)) as Record<string, unknown>;
		const { adminAdapter } = getPatrolRuntime(event);

		return await adminAdapter.listPatrolTasks({
			pageIndex: Number(body.pageIndex ?? body.page ?? 1),
			pageSize: Number(body.pageSize ?? 20),
			taskCode: toOptionalTrimmedString(body.taskCode),
			taskName: toOptionalTrimmedString(body.taskName),
			patrolStatus: toOptionalTrimmedString(body.patrolStatus ?? body.status),
			patrolMethod: toOptionalTrimmedString(body.patrolMethod),
			currentPatrolPerson: toOptionalTrimmedString(body.currentPatrolPerson ?? body.executor),
			sortBy: toPatrolTaskSortBy(body.sortBy),
			sortOrder: toSortOrder(body.sortOrder),
		});
	} catch (error) {
		setResponseStatus(event, 500);
		return adminFailure("查询失败", error);
	}
});

function toPatrolTaskSortBy(value: unknown): "createTime" | "updateTime" | "plannedStartTime" | undefined {
	return value === "createTime" || value === "updateTime" || value === "plannedStartTime" ? value : undefined;
}

function toSortOrder(value: unknown): "asc" | "desc" | undefined {
	return value === "asc" || value === "desc" ? value : undefined;
}
