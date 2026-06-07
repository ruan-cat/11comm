import type { MaintenanceService } from "./service";
import type { MaintenanceLegacyResponse } from "./types";

export const maintenanceLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-batch23",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ success, code, message, data, timestamp }",
	endpoints: [
		"/app/maintenance.listMaintenanceTasks",
		"/app/maintenance.queryMaintenanceTask",
		"/app/maintenance.listMaintenanceTaskDetails",
	],
	excludedWriteEndpoints: [
		"/app/maintenance.startMaintenanceTask",
		"/app/maintenance.completeMaintenanceTask",
		"/app/maintenance.submitMaintenanceSingle",
		"/app/maintenance.transferMaintenanceTask",
	],
	notCovered: [
		"/app/maintenance.startMaintenanceTask",
		"/app/maintenance.completeMaintenanceTask",
		"/app/maintenance.submitMaintenanceSingle",
		"/app/maintenance.transferMaintenanceTask",
		"db-backed-maintenance-data",
		"production-app-h5-maintenance-network",
	],
} as const;

export function createLegacyMaintenanceAdapter(service: MaintenanceService) {
	return {
		async listMaintenanceTasks(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const communityId = toString(input.communityId) ?? "COMM_001";
			const status = toString(input.status);

			return maintenanceSuccess(await service.listTasks({ page, row, communityId, status }));
		},

		async queryMaintenanceTask(input: Record<string, unknown>) {
			const taskId = toString(input.taskId);

			if (!taskId) {
				return maintenanceFailure("taskId is required", "400");
			}

			const task = await service.getTask(taskId);

			if (!task) {
				return maintenanceFailure("task not found", "404");
			}

			return maintenanceSuccess({ task });
		},

		async listMaintenanceTaskDetails(input: Record<string, unknown>) {
			const taskId = toString(input.taskId);

			if (!taskId) {
				return maintenanceFailure("taskId is required", "400");
			}

			const items = await service.listTaskDetails(taskId);

			if (!items) {
				return maintenanceFailure("task not found", "404");
			}

			return maintenanceSuccess({ items });
		},
	};
}

function maintenanceSuccess<T>(data: T, message = "success"): MaintenanceLegacyResponse<T> {
	return {
		success: true,
		code: "0",
		message,
		data,
		timestamp: Date.now(),
	};
}

function maintenanceFailure(message: string, code: string): MaintenanceLegacyResponse<null> {
	return {
		success: false,
		code,
		message,
		data: null,
		timestamp: Date.now(),
	};
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
