import {
	ptPatrolPlans,
	ptPatrolPaths,
	ptPatrolPoints,
	ptPatrolItems,
	ptPatrolTasks,
	ptPatrolTaskDetails,
	type NewPtPatrolPlan as InsertPtPatrolPlan,
	type NewPtPatrolPath as InsertPtPatrolPath,
	type NewPtPatrolPoint as InsertPtPatrolPoint,
	type NewPtPatrolItem as InsertPtPatrolItem,
	type NewPtPatrolTask as InsertPtPatrolTask,
	type NewPtPatrolTaskDetail as InsertPtPatrolTaskDetail,
} from "@01s-11comm/type";
import { mockPlanData } from "../../api/property-manage/patrol-manage/plan/mock-data";
import { mockPathData } from "../../api/property-manage/patrol-manage/path/mock-data";
import { mockItemData } from "../../api/property-manage/patrol-manage/item/mock-data";
import { mockTaskData } from "../../api/property-manage/patrol-manage/task/mock-data";
import { mockDetailData } from "../../api/property-manage/patrol-manage/detail/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, generateUuid } from "./index";
import { db } from "../index";

/**
 * 生成巡检管理模块的 SQL
 */
export function generatePatrolSql(idMap: IdMapRegistry): SqlStatement[] {
	const statements: SqlStatement[] = [];
	const defaultCommunityId = idMap.get("cm_communities", "COMM001") || generateUuid("cm_communities", "COMM001");

	// Store generated IDs for referencing
	const planIdMap = new Map<string, string>();
	const pathIdMap = new Map<string, string>();
	const pointIdMap = new Map<string, { id: string; sortOrder: number; pointName: string }>();
	const taskIdMap = new Map<string, string>();

	// ==========================================
	// 1. 生成 pt_patrol_plans (巡检计划)
	// ==========================================
	console.log("正在生成 pt_patrol_plans SQL...");
	const planRecords: InsertPtPatrolPlan[] = mockPlanData.map((item) => {
		const id = idMap.register("pt_patrol_plans", item.planName); // Use Name as key as it's unique enough for seeding
		planIdMap.set(item.planName, id);

		// Parse times
		let startD = null;
		let endD = null;
		if (item.dateRange) {
			const parts = item.dateRange.split("至");
			if (parts.length === 2) {
				startD = parts[0];
				endD = parts[1];
			}
		}

		return {
			id: id,
			communityId: defaultCommunityId,
			planName: item.planName,
			patrolType: "manual", // defaulting
			patrolLevel: "normal",
			planDescription: item.remark,
			frequency: item.planCycle,
			startDate: startD,
			endDate: endD,
			executionTimeSlot: item.timeRange,
			remark: item.remark,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	// Get default plan ID for fallback
	const defaultPlanId = planRecords.length > 0 ? planIdMap.values().next().value : null;

	if (planRecords.length > 0) {
		const query = db.insert(ptPatrolPlans).values(planRecords).toSQL();
		statements.push({
			table: "pt_patrol_plans",
			sql: toFullSql(query.sql, query.params),
			recordCount: planRecords.length,
		});
		console.log(`✅ 已生成 pt_patrol_plans SQL，共 ${planRecords.length} 条记录`);
	}

	// ==========================================
	// 2. 生成 pt_patrol_paths (巡检路线)
	// ==========================================
	console.log("正在生成 pt_patrol_paths SQL...");
	// Extract unique paths from mockPathData (which contains Point-Path pairs)
	const uniquePaths = new Map<string, any>();

	// Need to link Path -> Plan. usage: mockDetailData has relationship Plan <-> Route?
	// `mockDetailData` maps `patrolPlanName` to `patrolRouteName`.
	const routeToPlanMap = new Map<string, string>();
	mockDetailData.forEach((d) => {
		if (d.patrolRouteName && d.patrolPlanName) {
			routeToPlanMap.set(d.patrolRouteName, d.patrolPlanName);
		}
	});

	mockPathData.forEach((item) => {
		if (!uniquePaths.has(item.name)) {
			uniquePaths.set(item.name, item);
		}
	});

	const pathRecords: InsertPtPatrolPath[] = [];

	for (const [name, item] of uniquePaths) {
		const id = idMap.register("pt_patrol_paths", name);

		// Find plan ID
		const planName = routeToPlanMap.get(name);
		let planId: string | null = null;
		if (planName) {
			planId = planIdMap.get(planName) ?? null;
		}

		// Fallback: Link to first plan if not found
		if (!planId && defaultPlanId) {
			planId = defaultPlanId;
		}
		if (!planId) continue; // Skip if no plan

		pathIdMap.set(name, id);

		pathRecords.push({
			id: id,
			planId: planId,
			pathName: name,
			pathDescription: item.remark,
			estimatedDuration: 60, // Mock default
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		} as InsertPtPatrolPath);
	}

	if (pathRecords.length > 0) {
		const query = db.insert(ptPatrolPaths).values(pathRecords).toSQL();
		statements.push({
			table: "pt_patrol_paths",
			sql: toFullSql(query.sql, query.params),
			recordCount: pathRecords.length,
		});
		console.log(`✅ 已生成 pt_patrol_paths SQL，共 ${pathRecords.length} 条记录`);
	}

	// ==========================================
	// 3. 生成 pt_patrol_points (巡检点)
	// ==========================================
	console.log("正在生成 pt_patrol_points SQL...");
	const pointRecords: InsertPtPatrolPoint[] = mockPathData
		.map((item, index) => {
			// item in mockPathData is effectively a Point associated with a Path
			const pointKey = item.patrolPointName + item.name;
			const id = idMap.register("pt_patrol_points", pointKey); // Point Name + Path Name to be unique in map if needed

			const pathId = pathIdMap.get(item.name);
			if (!pathId) return null;

			// Store for later reference
			pointIdMap.set(pointKey, { id, sortOrder: index, pointName: item.patrolPointName });

			return {
				id: id,
				pathId: pathId,
				pointName: item.patrolPointName,
				location: item.patrolLocation,
				qrCodeOrNfc: `QR-${index}`,
				sortOrder: index,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
			};
		})
		.filter((x) => x !== null) as InsertPtPatrolPoint[];

	if (pointRecords.length > 0) {
		const query = db.insert(ptPatrolPoints).values(pointRecords).toSQL();
		statements.push({
			table: "pt_patrol_points",
			sql: toFullSql(query.sql, query.params),
			recordCount: pointRecords.length,
		});
		console.log(`✅ 已生成 pt_patrol_points SQL，共 ${pointRecords.length} 条记录`);
	}

	// ==========================================
	// 4. 生成 pt_patrol_items (巡检项目)
	// ==========================================
	console.log("正在生成 pt_patrol_items SQL...");
	const itemRecords: InsertPtPatrolItem[] = [];

	// Assign random items to points
	// For each point, assign 1-3 items from mockItemData
	if (pointIdMap.size > 0 && mockItemData.length > 0) {
		for (const [, pointInfo] of pointIdMap) {
			// Take 2 items for each point
			for (let i = 0; i < 2; i++) {
				const itemData = mockItemData[(pointInfo.sortOrder + i) % mockItemData.length]; // Deterministic selection
				const id = idMap.register("pt_patrol_items", `${pointInfo.pointName}-${itemData.name}-${i}`);

				itemRecords.push({
					id: id,
					pointId: pointInfo.id,
					itemName: itemData.name,
					checkStandard: "正常",
					checkMethod: "目视",
					createTime: new Date(),
					updateTime: new Date(),
				} as InsertPtPatrolItem);
			}
		}
	}

	if (itemRecords.length > 0) {
		const query = db.insert(ptPatrolItems).values(itemRecords).toSQL();
		statements.push({
			table: "pt_patrol_items",
			sql: toFullSql(query.sql, query.params),
			recordCount: itemRecords.length,
		});
		console.log(`✅ 已生成 pt_patrol_items SQL，共 ${itemRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 pt_patrol_tasks (巡检任务)
	// ==========================================
	console.log("正在生成 pt_patrol_tasks SQL...");
	const taskRecords: InsertPtPatrolTask[] = mockTaskData
		.map((item) => {
			const id = idMap.register("pt_patrol_tasks", item.taskCode);

			const planId = planIdMap.get(item.patrolPlan); // Link via Plan Name
			if (!planId) return null;

			// Store for later reference
			taskIdMap.set(planId, id);

			return {
				id: id,
				planId: planId,
				taskCode: item.taskCode,
				taskName: item.name,
				plannedPatroller: item.plannedPatrolPerson,
				patrolMethod: item.patrolMethod,
				status: "completed" as const, // Mock data says completed
				currentPatrolPerson: item.currentPatrolPerson,
				transferDescription: item.transferDescription,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
			};
		})
		.filter((x) => x !== null) as InsertPtPatrolTask[];

	if (taskRecords.length > 0) {
		const query = db.insert(ptPatrolTasks).values(taskRecords).toSQL();
		statements.push({
			table: "pt_patrol_tasks",
			sql: toFullSql(query.sql, query.params),
			recordCount: taskRecords.length,
		});
		console.log(`✅ 已生成 pt_patrol_tasks SQL，共 ${taskRecords.length} 条记录`);
	}

	// ==========================================
	// 6. 生成 pt_patrol_task_details (任务明细)
	// ==========================================
	console.log("正在生成 pt_patrol_task_details SQL...");
	const detailRecords: InsertPtPatrolTaskDetail[] = mockDetailData
		.map((item) => {
			const id = idMap.register("pt_patrol_task_details", item.taskDetailId);

			let taskId: string | null = null;
			// Find a task that has this plan
			const planId = planIdMap.get(item.patrolPlanName);
			if (planId) {
				taskId = taskIdMap.get(planId) ?? null;
			}

			if (!taskId) return null;

			// Find Point ID
			// Point stored as "PointName" + "RouteName" (Path Name) in ID generation?
			// `mockPathData` used `item.patrolPointName + item.name` (Point+Path)
			// `mockDetailData` has `patrolPointName` and `patrolRouteName`.
			let pointInfo = pointIdMap.get(item.patrolPointName + item.patrolRouteName);

			if (!pointInfo) {
				// Try removing "巡检点" suffix from detail's point name (e.g. "北区大门巡检点" -> "北区大门")
				const strippedName = item.patrolPointName.replace(/巡检点$/, "");
				pointInfo = pointIdMap.get(strippedName + item.patrolRouteName);
			}

			if (!pointInfo) {
				// console.warn(`Skipping Detail: Point not found for ${item.patrolPointName} in ${item.patrolRouteName}`);
				return null;
			}

			return {
				id: id,
				taskId: taskId,
				pointId: pointInfo.id,
				checkInStatus: "checked" as const,
				patrolSituation: item.patrolSituation,
				patrolPhotoUrl: item.patrolPhotos,
				checkInTime: item.actualPatrolTime ? new Date(item.actualPatrolTime) : new Date(),
				gpsCoordinates: item.locationInfo,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
			};
		})
		.filter((x) => x !== null) as InsertPtPatrolTaskDetail[];

	if (detailRecords.length > 0) {
		const query = db.insert(ptPatrolTaskDetails).values(detailRecords).toSQL();
		statements.push({
			table: "pt_patrol_task_details",
			sql: toFullSql(query.sql, query.params),
			recordCount: detailRecords.length,
		});
		console.log(`✅ 已生成 pt_patrol_task_details SQL，共 ${detailRecords.length} 条记录`);
	}

	return statements;
}
