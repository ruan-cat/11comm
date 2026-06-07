import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { WorkOrderService } from "./service";

export const workOrderLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/workorder/todo/list",
		"/app/workorder/detail",
		"/app/workorder/copy/list",
		"/app/workorder/task/list",
		"/app/workorder/task/items",
	],
	guardedEndpoints: [
		"/app/workorder/create",
		"/app/workorder/update",
		"/app/workorder/start",
		"/app/workorder/complete",
		"/app/workorder/audit",
		"/app/workorder/cancel",
		"/app/workorder/copy/finish",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: [
		"work-order-write-read-back-rollback",
		"production-app-h5-work-order-network",
		"db-ready-work-order-write-path",
	],
} as const;

export function createLegacyWorkOrderAdapter(service: WorkOrderService) {
	return {
		async listTodo(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const communityId = toString(input.communityId) || "COMM_001";
			const status = toString(input.status);
			const type = toString(input.type);
			const keyword = toString(input.keyword)?.toLowerCase();

			return legacySuccess(await service.listTodo({ page, row, communityId, status, type, keyword }), "query success");
		},

		async listCopy(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const status = toString(input.status);
			const keyword = toString(input.keyword)?.toLowerCase();

			return legacySuccess(await service.listCopy({ page, row, status, keyword }), "query success");
		},

		async getDetail(input: Record<string, unknown>) {
			const orderId = toString(input.orderId);
			if (!orderId) {
				return legacyFailure("work order id is required", 400);
			}

			const order = await service.getDetail(orderId);
			if (!order) {
				return legacyFailure("work order not found", 404);
			}

			return legacySuccess({ order }, "query success");
		},

		async listTasks(input: Record<string, unknown>) {
			const workId = toString(input.workId);
			if (!workId) {
				return legacyFailure("work order id is required", 400);
			}

			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 100);

			return legacySuccess(await service.listTasks({ page, row, workId }), "query success");
		},

		async listTaskItems(input: Record<string, unknown>) {
			const workId = toString(input.workId);
			if (!workId) {
				return legacyFailure("work order id is required", 400);
			}

			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 100);
			const states = parseStates(toString(input.states));

			return legacySuccess(await service.listTaskItems({ page, row, workId, states }), "query success");
		},

		async guardedWrite(endpoint: string, input: Record<string, unknown>) {
			void input;
			return legacyFailure(
				`Phase7 mutation guard blocked ${endpoint}; no work-order write read-back rollback evidence exists, so this endpoint stays guarded in apps/api.`,
				409,
				{ errorCode: "PHASE7_MUTATION_GUARDED" },
			);
		},
	};
}

function parseStates(states?: string): string[] {
	if (!states) {
		return [];
	}

	return states
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
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
