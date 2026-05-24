import type {
	MonitorArea,
	MonitorMachine,
	MonitorMachineQuery,
	PaginationQuery,
	PaginationResult,
	VideoPlayUrl,
	VideoPlayUrlQuery,
} from "./types";

export interface VideoRepository {
	listMonitorAreas(query: PaginationQuery): Promise<PaginationResult<MonitorArea>>;
	listStaffMonitorMachines(query: MonitorMachineQuery): Promise<PaginationResult<MonitorMachine>>;
	getPlayVideoUrl(query: VideoPlayUrlQuery): Promise<VideoPlayUrl>;
}

const monitorAreas: MonitorArea[] = [
	{ maId: "", maName: "All Areas" },
	{ maId: "AREA_001", maName: "North Gate Passage" },
	{ maId: "AREA_002", maName: "South Gate Plaza" },
	{ maId: "AREA_003", maName: "Underground Garage" },
];

const monitorMachines: MonitorMachine[] = Array.from({ length: 26 }, (_, index) => {
	const area = resolveMachineArea(index);
	return {
		machineId: `MACHINE_${String(index + 1).padStart(4, "0")}`,
		communityId: "COMM_001",
		machineName: `Monitor Device-${String(index + 1).padStart(2, "0")}`,
		maId: area.maId,
		maName: area.maName,
		photoUrl: `https://picsum.photos/seed/video-${index + 1}/640/360`,
	};
});

export function createVideoRepository(): VideoRepository {
	return {
		async listMonitorAreas(query) {
			return paginate(monitorAreas, query.page, query.row);
		},

		async listStaffMonitorMachines(query) {
			let filtered = [...monitorMachines];
			if (query.maId) {
				filtered = filtered.filter((item) => item.maId === query.maId);
			}
			if (query.machineNameLike) {
				filtered = filtered.filter((item) => item.machineName.includes(query.machineNameLike ?? ""));
			}

			return paginate(filtered, query.page, query.row);
		},

		async getPlayVideoUrl(query) {
			return {
				url: `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4?machineId=${encodeURIComponent(query.machineId)}`,
			};
		},
	};
}

function resolveMachineArea(index: number): MonitorArea {
	const areaIndex = index % 3;
	return monitorAreas[areaIndex + 1];
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	return {
		list: cloneValue(items.slice(start, end)),
		total: items.length,
		page,
		pageSize,
		hasMore: end < items.length,
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
