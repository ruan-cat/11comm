import type {
	InspectionItemTitle,
	InspectionItemTitleQuery,
	InspectionPaginationResult,
	InspectionStaff,
	InspectionTask,
	InspectionTaskDetail,
	InspectionTaskDetailQuery,
	InspectionTaskQuery,
	InspectionTodayReport,
} from "./types";

export interface InspectionRepository {
	listTodayReports(params: { communityId?: string; queryTime?: string }): Promise<InspectionTodayReport[]>;
	listStaffs(params: { communityId?: string }): Promise<InspectionStaff[]>;
	listInspectionItemTitles(query: InspectionItemTitleQuery): Promise<InspectionPaginationResult<InspectionItemTitle>>;
	listInspectionTasks(query: InspectionTaskQuery): Promise<InspectionPaginationResult<InspectionTask>>;
	listInspectionTaskDetails(
		query: InspectionTaskDetailQuery,
	): Promise<InspectionPaginationResult<InspectionTaskDetail>>;
}

const todayReports: InspectionTodayReport[] = [
	{ staffId: "STAFF_001", staffName: "张伟", finishCount: 8, waitCount: 2 },
	{ staffId: "STAFF_002", staffName: "李娜", finishCount: 6, waitCount: 1 },
	{ staffId: "STAFF_003", staffName: "王强", finishCount: 4, waitCount: 3 },
];

const staffList: InspectionStaff[] = [
	{ userId: "USER_001", userName: "张伟" },
	{ userId: "USER_002", userName: "李娜" },
	{ userId: "USER_003", userName: "王强" },
	{ userId: "USER_004", userName: "赵敏" },
];

const itemTitles = new Map<string, InspectionItemTitle[]>([
	[
		"ITEM_001",
		[
			{
				titleId: "TITLE_RADIO_001",
				itemTitle: "设施状态",
				titleType: "1001",
				radio: "",
				inspectionItemTitleValueDtos: [{ itemValue: "完好" }, { itemValue: "损坏" }, { itemValue: "需维修" }],
			},
			{
				titleId: "TITLE_CHECKBOX_002",
				itemTitle: "存在问题",
				titleType: "2002",
				radio: [],
				inspectionItemTitleValueDtos: [{ itemValue: "设备异常" }, { itemValue: "卫生问题" }, { itemValue: "安全隐患" }],
			},
			{
				titleId: "TITLE_TEXT_003",
				itemTitle: "详细说明",
				titleType: "3003",
				radio: "",
				inspectionItemTitleValueDtos: [],
			},
		],
	],
	[
		"ITEM_002",
		[
			{
				titleId: "TITLE_RADIO_004",
				itemTitle: "卫生情况",
				titleType: "1001",
				radio: "",
				inspectionItemTitleValueDtos: [{ itemValue: "良好" }, { itemValue: "一般" }, { itemValue: "较差" }],
			},
		],
	],
]);

const inspectionTasks: InspectionTask[] = [
	createInspectionTask(1, "20200406", "进行中", "2026-06-05 08:00:00"),
	createInspectionTask(2, "20200407", "已完成", "2026-06-05 09:00:00"),
	createInspectionTask(3, "20200408", "待补检", "2026-06-05 10:00:00"),
	createInspectionTask(4, "20200405", "待开始", "2026-06-05 11:00:00"),
	createInspectionTask(5, "20200406", "进行中", "2026-06-07 08:00:00"),
	createInspectionTask(6, "20200407", "已完成", "2026-06-07 09:00:00"),
	createInspectionTask(7, "20200408", "待补检", "2026-06-07 10:00:00"),
	createInspectionTask(8, "20200405", "待开始", "2026-06-07 11:00:00"),
	{
		...createInspectionTask(9, "20200405", "待开始", `${getTodayDate()} 08:30:00`),
		taskId: "TASK_TODAY_001",
	},
	{
		...createInspectionTask(10, "20200408", "待补检", `${getTodayDate()} 09:30:00`),
		taskId: "TASK_TODAY_002",
	},
];

const inspectionTaskDetails = new Map<string, InspectionTaskDetail[]>(
	inspectionTasks.map((task) => [
		task.taskId,
		[
			createInspectionTaskDetail(task.taskId, 1, "20200406", "进行中", "09:00"),
			createInspectionTaskDetail(task.taskId, 2, "20200407", "已完成", "10:00"),
			createInspectionTaskDetail(task.taskId, 3, "20200405", "待开始", "11:00"),
			createInspectionTaskDetail(task.taskId, 4, "20200408", "待补检", "12:00"),
		],
	]),
);

export function createInspectionRepository(): InspectionRepository {
	return {
		async listTodayReports(_params) {
			return cloneValue(todayReports);
		},

		async listStaffs(_params) {
			return cloneValue(staffList);
		},

		async listInspectionItemTitles(query) {
			return cloneValue(createPaginationResponse(itemTitles.get(query.itemId) ?? [], query.page, query.row));
		},

		async listInspectionTasks(query) {
			return cloneValue(createPaginationResponse(filterInspectionTasks(query), query.page, query.row));
		},

		async listInspectionTaskDetails(query) {
			return cloneValue(createPaginationResponse(filterInspectionTaskDetails(query), query.page, query.row));
		},
	};
}

function createInspectionTask(index: number, state: string, stateName: string, planInsTime: string): InspectionTask {
	const paddedIndex = index.toString().padStart(3, "0");
	const planIndex = ((index - 1) % 6) + 1;
	const userIndex = ((index - 1) % 4) + 1;
	const signTypes = [
		{ value: "GPS", label: "移动定位" },
		{ value: "QRCODE", label: "二维码扫描" },
		{ value: "MANUAL", label: "手动签到" },
	];
	const signType = signTypes[(index - 1) % signTypes.length];

	return {
		taskId: `TASK_${paddedIndex}`,
		inspectionPlanId: `PLAN_${planIndex.toString().padStart(3, "0")}`,
		inspectionPlanName: `巡检计划 ${planIndex}`,
		planUserName: staffList[(userIndex - 1) % staffList.length]?.userName ?? "巡检员",
		planInsTime,
		signTypeName: signType.label,
		stateName,
		state,
		originalPlanUserId: `USER_${userIndex.toString().padStart(3, "0")}`,
		originalPlanUserName: staffList[(userIndex - 1) % staffList.length]?.userName ?? "巡检员",
		planUserId: `USER_${userIndex.toString().padStart(3, "0")}`,
		signType: signType.value,
		statusCd: "0",
	};
}

function createInspectionTaskDetail(
	taskId: string,
	index: number,
	state: string,
	stateName: string,
	pointStartTime: string,
): InspectionTaskDetail {
	const paddedIndex = index.toString().padStart(3, "0");
	const endHour = Number(pointStartTime.slice(0, 2)) + 1;

	return {
		taskDetailId: `DETAIL_${taskId}_${paddedIndex}`,
		taskId,
		inspectionId: `INSP_${paddedIndex}`,
		inspectionName: `巡检点 ${index}`,
		itemId: `ITEM_${paddedIndex}`,
		state,
		stateName,
		pointStartTime,
		pointEndTime: `${endHour.toString().padStart(2, "0")}:00`,
	};
}

function filterInspectionTasks(query: InspectionTaskQuery): InspectionTask[] {
	const states = query.moreState
		?.split(",")
		.map((state) => state.trim())
		.filter(Boolean);
	const today = getTodayDate();

	return inspectionTasks
		.filter((task) => !states?.length || states.includes(task.state))
		.filter((task) => query.isToday !== 1 || task.planInsTime.startsWith(today))
		.filter((task) => query.canReexamine !== "2000" || task.state === "20200405" || task.state === "20200408")
		.filter((task) => !query.planInsTime || task.planInsTime.startsWith(query.planInsTime));
}

function filterInspectionTaskDetails(query: InspectionTaskDetailQuery): InspectionTaskDetail[] {
	let source: InspectionTaskDetail[] = [];

	if (query.taskId) {
		source = [...(inspectionTaskDetails.get(query.taskId) ?? [])];
	} else if (query.planUserId) {
		source = [...inspectionTaskDetails.values()].flat();
	} else if (query.inspectionId) {
		source = [...inspectionTaskDetails.values()].flat().filter((detail) => detail.inspectionId === query.inspectionId);
	} else {
		source = [...inspectionTaskDetails.values()].flat();
	}

	return source
		.filter((detail) => !query.state || detail.state === query.state)
		.filter((detail) => !query.qrCodeTime || detail.pointStartTime?.startsWith(query.qrCodeTime.slice(0, 2)));
}

function createPaginationResponse<T>(data: T[], page = 1, pageSize = 10): InspectionPaginationResult<T> {
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

function getTodayDate(): string {
	return new Date().toISOString().slice(0, 10);
}
