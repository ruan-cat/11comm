import type {
	PaginationResult,
	WorkOrderCopyQuery,
	WorkOrderDetail,
	WorkOrderListItem,
	WorkOrderTask,
	WorkOrderTaskItem,
	WorkOrderTaskItemQuery,
	WorkOrderTaskQuery,
	WorkOrderTodoQuery,
} from "./types";

export interface WorkOrderRepository {
	listTodo(query: WorkOrderTodoQuery): Promise<PaginationResult<WorkOrderListItem>>;
	listCopy(query: WorkOrderCopyQuery): Promise<PaginationResult<WorkOrderListItem>>;
	getDetail(orderId: string): Promise<WorkOrderDetail | undefined>;
	listTasks(query: WorkOrderTaskQuery): Promise<PaginationResult<WorkOrderTask>>;
	listTaskItems(query: WorkOrderTaskItemQuery): Promise<PaginationResult<WorkOrderTaskItem>>;
}

const todoOrders: WorkOrderListItem[] = [
	createWorkOrder({
		index: 1,
		communityId: "COMM_001",
		communityName: "Sunshine Community",
		title: "Public area cleaning",
		status: "10001",
		statusName: "Pending",
		type: "1",
		typeName: "Daily work",
	}),
	createWorkOrder({
		index: 2,
		communityId: "COMM_001",
		communityName: "Sunshine Community",
		title: "Elevator inspection",
		status: "10002",
		statusName: "Processing",
		type: "2",
		typeName: "Temporary task",
		staffId: "STAFF_002",
		staffName: "Lee",
	}),
	createWorkOrder({
		index: 3,
		communityId: "COMM_002",
		communityName: "Riverside Community",
		title: "Parking lot patrol",
		status: "10001",
		statusName: "Pending",
		type: "1",
		typeName: "Daily work",
	}),
];

const copyOrders: WorkOrderListItem[] = [
	createWorkOrder({
		index: 100,
		communityId: "COMM_001",
		communityName: "Sunshine Community",
		title: "Copied elevator inspection",
		status: "10002",
		statusName: "Processing",
		type: "2",
		typeName: "Temporary task",
		isCopyToMe: true,
		staffId: "STAFF_003",
		staffName: "Chen",
	}),
	createWorkOrder({
		index: 101,
		communityId: "COMM_001",
		communityName: "Sunshine Community",
		title: "Copied patrol follow-up",
		status: "10003",
		statusName: "Completed",
		type: "1",
		typeName: "Daily work",
		isCopyToMe: true,
		staffId: "STAFF_004",
		staffName: "Wang",
	}),
];

const workOrderDetails = new Map<string, WorkOrderDetail>(
	[...todoOrders, ...copyOrders].map((order) => [
		order.orderId,
		{
			...order,
			attachments: [`https://example.test/work-orders/${order.orderId}.jpg`],
			copyUsers: [{ userId: "USER_001", userName: "Copy User" }],
			operationLogs: [
				{
					logId: `LOG_${order.orderId}_001`,
					orderId: order.orderId,
					operationType: "create",
					operationTypeName: "Create",
					operatorId: order.creatorId,
					operatorName: order.creatorName,
					operationTime: order.createTime,
					remark: "Seeded exact handler evidence",
				},
			],
		},
	]),
);

const workOrderTasks: WorkOrderTask[] = [
	createTask("WO_001", 1, "W", "STAFF_001", "Zhang"),
	createTask("WO_001", 2, "C", "STAFF_002", "Lee"),
	createTask("WO_002", 1, "W", "STAFF_003", "Chen"),
	createTask("WORK_001", 1, "W", "STAFF_004", "Wang"),
];

const workOrderTaskItems: WorkOrderTaskItem[] = [
	createTaskItem("WO_001", 1, "W", "Check public area cleanliness"),
	createTaskItem("WO_001", 2, "C", "Finish equipment inspection", {
		remark: "Equipment is normal",
		finishTime: "2026-05-23 18:00:00",
		pathUrls: ["https://example.test/work-orders/WO_001-task.jpg"],
	}),
	createTaskItem("WO_001", 3, "P", "Review handling result"),
	createTaskItem("WO_002", 1, "W", "Inspect elevator status"),
	createTaskItem("WORK_001", 1, "W", "Compat work id smoke task"),
];

export function createWorkOrderRepository(): WorkOrderRepository {
	return {
		async listTodo(query) {
			let filtered = todoOrders.filter((order) => order.communityId === query.communityId);
			if (query.status) {
				filtered = filtered.filter((order) => order.status === query.status);
			}
			if (query.type) {
				filtered = filtered.filter((order) => order.type === query.type);
			}
			if (query.keyword) {
				filtered = filtered.filter(
					(order) =>
						order.title.toLowerCase().includes(query.keyword ?? "") ||
						order.content.toLowerCase().includes(query.keyword ?? ""),
				);
			}

			return paginate(filtered, query.page, query.row);
		},

		async listCopy(query) {
			let filtered = [...copyOrders];
			if (query.status) {
				filtered = filtered.filter((order) => order.status === query.status);
			}
			if (query.keyword) {
				filtered = filtered.filter(
					(order) =>
						order.title.toLowerCase().includes(query.keyword ?? "") ||
						order.content.toLowerCase().includes(query.keyword ?? ""),
				);
			}

			return paginate(filtered, query.page, query.row);
		},

		async getDetail(orderId) {
			const order = workOrderDetails.get(orderId);
			return order ? cloneValue(order) : undefined;
		},

		async listTasks(query) {
			const filtered = findByWorkId(workOrderTasks, query.workId).map((task) => ({
				...task,
				workId: query.workId,
			}));

			return paginate(filtered, query.page, query.row);
		},

		async listTaskItems(query) {
			let filtered = findByWorkId(workOrderTaskItems, query.workId);
			const states = new Set(query.states ?? []);

			if (states.size > 0) {
				filtered = filtered.filter((item) => states.has(item.state));
			}

			return paginate(
				filtered.map((item) => ({
					...item,
					workId: query.workId,
				})),
				query.page,
				query.row,
			);
		},
	};
}

function createWorkOrder(input: {
	index: number;
	communityId: string;
	communityName: string;
	title: string;
	status: string;
	statusName: string;
	type: string;
	typeName: string;
	staffId?: string;
	staffName?: string;
	isCopyToMe?: boolean;
}): WorkOrderListItem {
	const id = String(input.index).padStart(3, "0");
	return {
		orderId: `WO_${id}`,
		orderNo: `WO20260524${id}`,
		title: input.title,
		type: input.type,
		typeName: input.typeName,
		status: input.status,
		statusName: input.statusName,
		priority: "2",
		priorityName: "Normal",
		content: `${input.title} for ${input.communityName}`,
		staffId: input.staffId,
		staffName: input.staffName,
		creatorId: "ADMIN_001",
		creatorName: "Admin",
		planStartTime: "2026-05-24 09:00:00",
		planEndTime: "2026-05-24 18:00:00",
		createTime: "2026-05-24 08:30:00",
		communityId: input.communityId,
		communityName: input.communityName,
		isCopyToMe: input.isCopyToMe,
	};
}

function createTask(workId: string, index: number, state: string, staffId: string, staffName: string): WorkOrderTask {
	const normalized = normalizeWorkId(workId);
	return {
		taskId: `TASK_${normalized}_${String(index).padStart(3, "0")}`,
		workId,
		staffId,
		staffName,
		state,
		createTime: "2026-05-24 09:00:00",
	};
}

function createTaskItem(
	workId: string,
	index: number,
	state: string,
	content: string,
	extras: Pick<WorkOrderTaskItem, "finishTime" | "pathUrls" | "remark"> = {},
): WorkOrderTaskItem {
	const normalized = normalizeWorkId(workId);
	return {
		itemId: `ITEM_${normalized}_${String(index).padStart(3, "0")}`,
		workId,
		taskId: `TASK_${normalized}_${String(Math.min(index, 2)).padStart(3, "0")}`,
		content,
		staffId: `STAFF_${String(index).padStart(3, "0")}`,
		staffName: ["Zhang", "Lee", "Wang"][index - 1] ?? "Staff",
		state,
		createTime: "2026-05-24 09:30:00",
		...extras,
	};
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

function findByWorkId<T extends { workId: string }>(items: T[], workId: string): T[] {
	const exact = items.filter((item) => item.workId === workId);
	if (exact.length > 0) {
		return exact;
	}

	const normalized = normalizeWorkId(workId);
	return items.filter((item) => normalizeWorkId(item.workId) === normalized);
}

function normalizeWorkId(workId: string): string {
	return workId.replace(/^WORK_/, "WO_");
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
