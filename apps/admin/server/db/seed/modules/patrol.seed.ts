import {
	ptPatrolPlans,
	ptPatrolPaths,
	ptPatrolPoints,
	ptPatrolItems,
	ptPatrolTasks,
	ptPatrolTaskDetails,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "patrol",
	dependencies: ["house-property", "setting"],
	async seed(db) {
		await db.insert(ptPatrolPlans).values(
			rows([
				{
					id: sid("patrol-plan", "daily"),
					communityId: sid("community", "sunshine"),
					planName: "日常巡检计划",
					patrolType: "manual",
					patrolLevel: "normal",
					startDate: new Date("2024-01-01"),
					endDate: new Date("2024-12-31"),
				},
				{
					id: sid("patrol-plan", "night"),
					communityId: sid("community", "sunshine"),
					planName: "夜间安保计划",
					patrolType: "manual",
					patrolLevel: "high",
					startDate: new Date("2024-01-01"),
					endDate: new Date("2024-12-31"),
				},
			]),
		);

		await db.insert(ptPatrolPaths).values(
			rows([
				{
					id: sid("patrol-path", "main"),
					planId: sid("patrol-plan", "daily"),
					pathName: "主楼巡检路线",
					estimatedDuration: 45,
				},
				{
					id: sid("patrol-path", "garage"),
					planId: sid("patrol-plan", "night"),
					pathName: "地下车库路线",
					estimatedDuration: 30,
				},
			]),
		);

		await db.insert(ptPatrolPoints).values(
			rows([
				{
					id: sid("patrol-point", "gate"),
					pathId: sid("patrol-path", "main"),
					pointName: "大门岗",
					location: "小区正门",
					sortOrder: 1,
				},
				{
					id: sid("patrol-point", "garage-entrance"),
					pathId: sid("patrol-path", "garage"),
					pointName: "地下车库入口",
					location: "B1层入口",
					sortOrder: 1,
				},
				{
					id: sid("patrol-point", "fire-exit"),
					pathId: sid("patrol-path", "main"),
					pointName: "消防通道",
					location: "1号楼东侧",
					sortOrder: 2,
				},
			]),
		);

		await db.insert(ptPatrolItems).values(
			rows([
				{
					id: sid("patrol-item", "access"),
					pointId: sid("patrol-point", "gate"),
					itemName: "检查门禁系统",
					checkStandard: "门禁正常开闭",
					checkMethod: "目视检查",
				},
				{
					id: sid("patrol-item", "fire"),
					pointId: sid("patrol-point", "fire-exit"),
					itemName: "检查消防设施",
					checkStandard: "灭火器在有效期内",
					checkMethod: "查看标签",
				},
				{
					id: sid("patrol-item", "camera"),
					pointId: sid("patrol-point", "garage-entrance"),
					itemName: "检查监控摄像头",
					checkStandard: "画面清晰无遮挡",
					checkMethod: "远程查看",
				},
			]),
		);

		await db.insert(ptPatrolTasks).values(
			rows([
				{
					id: sid("patrol-task", "1"),
					planId: sid("patrol-plan", "daily"),
					taskCode: "PT-2024-001",
					taskName: "1月日常巡检",
					plannedPatroller: "赵六",
					patrolMethod: "walk",
					status: "completed",
					actualPatrolTime: new Date("2024-01-15 09:30:00"),
				},
				{
					id: sid("patrol-task", "2"),
					planId: sid("patrol-plan", "night"),
					taskCode: "PT-2024-002",
					taskName: "1月夜间巡检",
					plannedPatroller: "赵六",
					patrolMethod: "walk",
					status: "in_progress",
				},
			]),
		);

		await db.insert(ptPatrolTaskDetails).values(
			rows([
				{
					id: sid("patrol-detail", "1"),
					taskId: sid("patrol-task", "1"),
					pointId: sid("patrol-point", "gate"),
					checkInStatus: "checked",
					patrolSituation: "正常",
					checkInTime: new Date("2024-01-15 09:30:00"),
				},
				{
					id: sid("patrol-detail", "2"),
					taskId: sid("patrol-task", "1"),
					pointId: sid("patrol-point", "fire-exit"),
					checkInStatus: "checked",
					patrolSituation: "正常",
					checkInTime: new Date("2024-01-15 09:45:00"),
				},
			]),
		);
	},
});
