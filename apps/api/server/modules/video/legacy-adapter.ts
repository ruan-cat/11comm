import { legacySuccess } from "../../shared/runtime/response-builder";
import type { VideoService } from "./service";

export const videoLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-pilot",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready-no-real-camera",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/video.listMonitorArea", "/app/video.listStaffMonitorMachine", "/app/video.getPlayVideoUrl"],
	notCovered: ["real-camera-platform", "db-backed-video-data", "video-stream-control"],
} as const;

export function createLegacyVideoAdapter(service: VideoService) {
	return {
		async listMonitorArea(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 20);

			return legacySuccess(await service.listMonitorAreas({ page, row }), "query success");
		},

		async listStaffMonitorMachine(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const maId = toString(input.maId);
			const machineNameLike = toString(input.machineNameLike);

			return legacySuccess(
				await service.listStaffMonitorMachines({ page, row, maId, machineNameLike }),
				"query success",
			);
		},

		async getPlayVideoUrl(input: Record<string, unknown>) {
			const machineId = toString(input.machineId) || "MACHINE_0001";

			return legacySuccess(await service.getPlayVideoUrl({ machineId }), "query success");
		},
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
