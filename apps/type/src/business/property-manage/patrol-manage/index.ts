/**
 * @file patrol-manage 模块类型导出
 * @description 统一导出 patrol-manage 相关的所有业务类型
 */

export * from "./detail";
export * from "./item";
export * from "./path";
export * from "./plan";
export * from "./point";
/** 显式导出 task 模块，排除与 detail 模块冲突的 taskStatusOptions */
export type {
	PatrolTaskFormVO,
	PatrolTaskFormProps,
	TaskListItem,
	TaskQueryParams,
	PatrolTaskListItem,
	PatrolTaskQueryParams,
} from "./task";
// 使用 export 导出值
export { defaultPatrolTaskForm, patrolStatusOptions } from "./task";
