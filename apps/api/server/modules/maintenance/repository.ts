import type {
	MaintenancePaginationResponse,
	MaintenanceTask,
	MaintenanceTaskDetail,
	MaintenanceTaskQuery,
} from "./types";

export interface MaintenanceRepository {
	listTasks(query: MaintenanceTaskQuery): Promise<MaintenancePaginationResponse<MaintenanceTask>>;
	getTask(taskId: string): Promise<MaintenanceTask | undefined>;
	listTaskDetails(taskId: string): Promise<MaintenanceTaskDetail[] | undefined>;
}

const maintenanceTasks: MaintenanceTask[] = [
	{
		taskId: "MT_001",
		taskName: "Elevator 1 scheduled maintenance",
		machineName: "Elevator 1",
		machineId: "MACHINE_001",
		planTime: "2026-06-01 09:00:00",
		status: "10001",
		statusName: "Pending",
		communityId: "COMM_001",
	},
	{
		taskId: "MT_002",
		taskName: "Fire pump scheduled maintenance",
		machineName: "Fire pump",
		machineId: "MACHINE_002",
		planTime: "2026-06-02 10:00:00",
		status: "10002",
		statusName: "Processing",
		staffId: "STAFF_001",
		staffName: "Staff 001",
		communityId: "COMM_001",
	},
	{
		taskId: "MT_003",
		taskName: "Power room scheduled maintenance",
		machineName: "Power room equipment",
		machineId: "MACHINE_003",
		planTime: "2026-06-03 11:00:00",
		status: "10003",
		statusName: "Completed",
		staffId: "STAFF_002",
		staffName: "Staff 002",
		communityId: "COMM_001",
	},
	{
		taskId: "MT_004",
		taskName: "Access control scheduled maintenance",
		machineName: "Access control",
		machineId: "MACHINE_004",
		planTime: "2026-06-04 14:00:00",
		status: "10001",
		statusName: "Pending",
		communityId: "COMM_002",
	},
];

const maintenanceTaskDetails: Record<string, MaintenanceTaskDetail[]> = {
	MT_001: [
		{
			taskDetailId: "MTD_MT_001_01",
			taskId: "MT_001",
			itemName: "Appearance check",
			itemContent: "Check exterior condition and corrosion.",
		},
		{
			taskDetailId: "MTD_MT_001_02",
			taskId: "MT_001",
			itemName: "Running state check",
			itemContent: "Check running noise and vibration.",
			result: "Normal",
		},
	],
	MT_002: [
		{
			taskDetailId: "MTD_MT_002_01",
			taskId: "MT_002",
			itemName: "Lubrication",
			itemContent: "Lubricate moving parts.",
			result: "Normal",
			remark: "No exception",
		},
	],
	MT_003: [
		{
			taskDetailId: "MTD_MT_003_01",
			taskId: "MT_003",
			itemName: "Electrical system check",
			itemContent: "Check wiring and terminals.",
			result: "Normal",
			photos: ["https://example.test/maintenance/MT_003_01.png"],
		},
	],
	MT_004: [
		{
			taskDetailId: "MTD_MT_004_01",
			taskId: "MT_004",
			itemName: "Safety device check",
			itemContent: "Check safety devices.",
		},
	],
};

export function createMaintenanceRepository(): MaintenanceRepository {
	return {
		async listTasks(query) {
			let filtered = maintenanceTasks.filter((task) => task.communityId === query.communityId);

			if (query.status) {
				filtered = filtered.filter((task) => task.status === query.status);
			}

			return createPaginationResponse(cloneValue(filtered), query.page, query.row);
		},

		async getTask(taskId) {
			const task = maintenanceTasks.find((item) => item.taskId === taskId);
			return task ? cloneValue(task) : undefined;
		},

		async listTaskDetails(taskId) {
			if (!Object.hasOwn(maintenanceTaskDetails, taskId)) {
				return undefined;
			}

			return cloneValue(maintenanceTaskDetails[taskId] ?? []);
		},
	};
}

function createPaginationResponse<T>(data: T[], page: number, pageSize: number): MaintenancePaginationResponse<T> {
	const start = (page - 1) * pageSize;
	const end = start + pageSize;

	return {
		list: data.slice(start, end),
		total: data.length,
		page,
		pageSize,
		hasMore: end < data.length,
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
