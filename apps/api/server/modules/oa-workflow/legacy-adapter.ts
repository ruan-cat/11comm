import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { OaWorkflowService } from "./service";

export const oaWorkflowLegacyAdapterEvidence = {
	scope: "phase7-oa-workflow-readonly-and-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/oa/workflow/query",
		"/app/oa/workflow/form/query",
		"/app/oa/workflow/form/data/query",
		"/app/oa/workflow/task/undo/query",
		"/app/oa/workflow/task/his/query",
		"/app/oa/workflow/user/query",
		"/app/oa/workflow/image/run",
		"/app/oa/workflow/task/next",
		"/app/oa/workflow/undo/next-deal-user",
	],
	guardedEndpoints: [
		"/app/oa/workflow/form/save",
		"/app/oa/workflow/form/update",
		"/app/oa/workflow/audit",
		"/app/oa/workflow/undo/audit",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-oa-workflow-data", "production-app-h5-oa-workflow-network"],
} as const;

export function createLegacyOaWorkflowAdapter(service: OaWorkflowService) {
	return {
		async queryWorkflows(_input: Record<string, unknown>) {
			return legacySuccess({ flows: await service.getWorkflowFlows() }, "查询成功");
		},

		async queryForm(input: Record<string, unknown>) {
			const flowId = toString(input.flowId);
			if (!flowId) {
				return legacyFailure("flowId 不能为空", 400);
			}

			const form = await service.getForm(flowId);
			if (!form) {
				return legacyFailure("流程或表单不存在", 404);
			}

			return legacySuccess({ form }, "查询成功");
		},

		async queryFormData(input: Record<string, unknown>) {
			const result = await service.getFormData({
				page: toNumber(input.page, 1),
				row: toNumber(input.row, 10),
				flowId: toString(input.flowId) || "",
				id: toString(input.id),
			});
			return legacySuccess(result, "查询成功");
		},

		async queryUndoTasks(input: Record<string, unknown>) {
			const result = await service.getUndoList({
				page: toNumber(input.page, 1),
				row: toNumber(input.row, 10),
				flowId: toString(input.flowId) || "",
			});
			return legacySuccess(result, "查询成功");
		},

		async queryHisTasks(input: Record<string, unknown>) {
			const result = await service.getFinishList({
				page: toNumber(input.page, 1),
				row: toNumber(input.row, 10),
				flowId: toString(input.flowId) || "",
			});
			return legacySuccess(result, "查询成功");
		},

		async queryComments(input: Record<string, unknown>) {
			const id = toString(input.id) || "";
			return legacySuccess({ comments: await service.getComments(id) }, "查询成功");
		},

		async queryWorkflowImage(_input: Record<string, unknown>) {
			return legacySuccess({ image: await service.getWorkflowImage() }, "查询成功");
		},

		async queryNextTask(_input: Record<string, unknown>) {
			return legacySuccess({ tasks: await service.getNextTask() }, "查询成功");
		},

		async queryNextDealUser(_input: Record<string, unknown>) {
			return legacySuccess({ tasks: await service.getNextDealUser() }, "查询成功");
		},

		async guardedWrite(endpoint: string, _input: Record<string, unknown>) {
			return legacyMutationGuarded(endpoint);
		},
	};
}

function legacyMutationGuarded(action: string) {
	return legacyFailure(
		`Phase7 mutation guard blocked ${action}; oa-workflow writes stay guarded until write read-back rollback evidence is designed.`,
		409,
		{ errorCode: "PHASE7_MUTATION_GUARDED" },
	);
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	return `${value}`.trim();
}
