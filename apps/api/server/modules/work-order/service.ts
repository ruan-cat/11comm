import type { WorkOrderRepository } from "./repository";
import type { WorkOrderCopyQuery, WorkOrderTaskItemQuery, WorkOrderTaskQuery, WorkOrderTodoQuery } from "./types";

export interface WorkOrderService {
	listTodo(query: WorkOrderTodoQuery): ReturnType<WorkOrderRepository["listTodo"]>;
	listCopy(query: WorkOrderCopyQuery): ReturnType<WorkOrderRepository["listCopy"]>;
	getDetail(orderId: string): ReturnType<WorkOrderRepository["getDetail"]>;
	listTasks(query: WorkOrderTaskQuery): ReturnType<WorkOrderRepository["listTasks"]>;
	listTaskItems(query: WorkOrderTaskItemQuery): ReturnType<WorkOrderRepository["listTaskItems"]>;
}

export function createWorkOrderService(repository: WorkOrderRepository): WorkOrderService {
	return {
		listTodo: (query) => repository.listTodo(query),
		listCopy: (query) => repository.listCopy(query),
		getDetail: (orderId) => repository.getDetail(orderId),
		listTasks: (query) => repository.listTasks(query),
		listTaskItems: (query) => repository.listTaskItems(query),
	};
}
