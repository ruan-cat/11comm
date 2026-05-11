import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import {
	ptPatrolItems,
	ptPatrolPaths,
	ptPatrolPlans,
	ptPatrolPoints,
	ptPatrolTaskDetails,
	ptPatrolTasks,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	AdminPatrolDetailListItem,
	AdminPatrolItemListItem,
	AdminPatrolPathListItem,
	AdminPatrolPlanListItem,
	AdminPatrolPointListItem,
	AdminPatrolTaskListItem,
	ListPatrolDetailsParams,
	ListPatrolItemsParams,
	ListPatrolPathsParams,
	ListPatrolPlansParams,
	ListPatrolPointsParams,
	ListPatrolTasksParams,
} from "./types";

export interface PatrolRepository {
	listPatrolItems: (params: ListPatrolItemsParams) => Promise<{ list: AdminPatrolItemListItem[]; total: number }>;
	listPatrolPaths: (params: ListPatrolPathsParams) => Promise<{ list: AdminPatrolPathListItem[]; total: number }>;
	listPatrolPlans: (params: ListPatrolPlansParams) => Promise<{ list: AdminPatrolPlanListItem[]; total: number }>;
	listPatrolPoints: (params: ListPatrolPointsParams) => Promise<{ list: AdminPatrolPointListItem[]; total: number }>;
	listPatrolTasks: (params: ListPatrolTasksParams) => Promise<{ list: AdminPatrolTaskListItem[]; total: number }>;
	listPatrolDetails: (params: ListPatrolDetailsParams) => Promise<{ list: AdminPatrolDetailListItem[]; total: number }>;
}

export function createPatrolRepository(options: { db?: DbType } = {}): PatrolRepository {
	return options.db ? createDbPatrolRepository(options.db) : createInMemoryPatrolRepository();
}

export function createDbPatrolRepository(db: DbType): PatrolRepository {
	const fallback = createInMemoryPatrolRepository();

	return Object.assign(fallback, {
		// ---- item/list ----
		async listPatrolItems(params: ListPatrolItemsParams): Promise<{ list: AdminPatrolItemListItem[]; total: number }> {
			const conditions: SQL[] = [];
			if (params.itemName) {
				conditions.push(like(ptPatrolItems.itemName, `%${params.itemName}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ptPatrolItems)
				.where(where);
			const rows = await db
				.select()
				.from(ptPatrolItems)
				.where(where)
				.orderBy(desc(ptPatrolItems.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					itemName: item.itemName || "",
					checkStandard: item.checkStandard,
					checkMethod: item.checkMethod,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- path/list ----
		async listPatrolPaths(params: ListPatrolPathsParams): Promise<{ list: AdminPatrolPathListItem[]; total: number }> {
			const conditions: SQL[] = [];
			if (params.pathName) {
				conditions.push(like(ptPatrolPaths.pathName, `%${params.pathName}%`));
			}
			if (params.planId) {
				conditions.push(eq(ptPatrolPaths.planId, params.planId as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ptPatrolPaths)
				.where(where);
			const rows = await db
				.select()
				.from(ptPatrolPaths)
				.where(where)
				.orderBy(desc(ptPatrolPaths.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					planId: item.planId || "",
					pathName: item.pathName || "",
					pathDescription: item.pathDescription,
					estimatedDuration: item.estimatedDuration,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- plan/list ----
		async listPatrolPlans(params: ListPatrolPlansParams): Promise<{ list: AdminPatrolPlanListItem[]; total: number }> {
			const conditions: SQL[] = [];
			if (params.planName) {
				conditions.push(like(ptPatrolPlans.planName, `%${params.planName}%`));
			}
			if (params.patrolType) {
				conditions.push(eq(ptPatrolPlans.patrolType, params.patrolType));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ptPatrolPlans)
				.where(where);
			const rows = await db
				.select()
				.from(ptPatrolPlans)
				.where(where)
				.orderBy(desc(ptPatrolPlans.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					communityId: item.communityId,
					planName: item.planName || "",
					patrolType: item.patrolType,
					patrolLevel: item.patrolLevel,
					planDescription: item.planDescription,
					frequency: item.frequency,
					startDate: item.startDate || null,
					endDate: item.endDate || null,
					executionTimeSlot: item.executionTimeSlot,
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- point/list ----
		async listPatrolPoints(
			params: ListPatrolPointsParams,
		): Promise<{ list: AdminPatrolPointListItem[]; total: number }> {
			const conditions: SQL[] = [];
			if (params.pointName) {
				conditions.push(like(ptPatrolPoints.pointName, `%${params.pointName}%`));
			}
			if (params.pathId) {
				conditions.push(eq(ptPatrolPoints.pathId, params.pathId as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ptPatrolPoints)
				.where(where);
			const rows = await db
				.select()
				.from(ptPatrolPoints)
				.where(where)
				.orderBy(desc(ptPatrolPoints.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					pathId: item.pathId || "",
					pointName: item.pointName || "",
					location: item.location,
					qrCodeOrNfc: item.qrCodeOrNfc,
					sortOrder: item.sortOrder,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- task/list ----
		async listPatrolTasks(params: ListPatrolTasksParams): Promise<{ list: AdminPatrolTaskListItem[]; total: number }> {
			const conditions: SQL[] = [];
			if (params.taskCode) {
				conditions.push(like(ptPatrolTasks.taskCode, `%${params.taskCode}%`));
			}
			if (params.taskName) {
				conditions.push(like(ptPatrolTasks.taskName, `%${params.taskName}%`));
			}
			if (params.patrolStatus) {
				conditions.push(eq(ptPatrolTasks.status, params.patrolStatus as any));
			}
			if (params.patrolMethod) {
				conditions.push(eq(ptPatrolTasks.patrolMethod, params.patrolMethod));
			}
			if (params.currentPatrolPerson) {
				conditions.push(like(ptPatrolTasks.currentPatrolPerson, `%${params.currentPatrolPerson}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const sortFields = {
				createTime: ptPatrolTasks.createTime,
				updateTime: ptPatrolTasks.updateTime,
				plannedStartTime: ptPatrolTasks.plannedStartTime,
			};
			const sortBy = params.sortBy ?? "createTime";
			const orderBy = params.sortOrder === "asc" ? asc(sortFields[sortBy]) : desc(sortFields[sortBy]);
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ptPatrolTasks)
				.where(where);
			const rows = await db
				.select({
					id: ptPatrolTasks.id,
					planId: ptPatrolTasks.planId,
					planName: ptPatrolPlans.planName,
					taskCode: ptPatrolTasks.taskCode,
					taskName: ptPatrolTasks.taskName,
					plannedPatroller: ptPatrolTasks.plannedPatroller,
					patrolMethod: ptPatrolTasks.patrolMethod,
					plannedStartTime: ptPatrolTasks.plannedStartTime,
					plannedEndTime: ptPatrolTasks.plannedEndTime,
					actualPatrolTime: ptPatrolTasks.actualPatrolTime,
					status: ptPatrolTasks.status,
					currentPatrolPerson: ptPatrolTasks.currentPatrolPerson,
					transferDescription: ptPatrolTasks.transferDescription,
					createTime: ptPatrolTasks.createTime,
					updateTime: ptPatrolTasks.updateTime,
				})
				.from(ptPatrolTasks)
				.leftJoin(ptPatrolPlans, eq(ptPatrolTasks.planId, ptPatrolPlans.id))
				.where(where)
				.orderBy(orderBy)
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id || "",
					name: item.taskName || "",
					status: item.status || "pending",
					remark: item.transferDescription || "",
					taskCode: item.taskCode || "",
					patrolPlan: item.planName || "",
					patrolPersonTimeRange: formatRange(item.plannedStartTime, item.plannedEndTime),
					actualPatrolTime: formatDateTime(item.actualPatrolTime),
					plannedPatrolPerson: item.plannedPatroller || "",
					currentPatrolPerson: item.currentPatrolPerson || "",
					transferDescription: item.transferDescription || "",
					patrolMethod: item.patrolMethod || "",
					patrolStatus: item.status || "pending",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- detail/list ----
		async listPatrolDetails(
			params: ListPatrolDetailsParams,
		): Promise<{ list: AdminPatrolDetailListItem[]; total: number }> {
			const conditions: SQL[] = [];
			if (params.taskStatus) {
				conditions.push(eq(ptPatrolTasks.status, params.taskStatus as any));
			}
			if (params.patrolMethod) {
				conditions.push(eq(ptPatrolTasks.patrolMethod, params.patrolMethod));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const sortFields = {
				createTime: ptPatrolTaskDetails.createTime,
				updateTime: ptPatrolTaskDetails.updateTime,
			};
			const sortBy = params.sortBy ?? "createTime";
			const orderBy = params.sortOrder === "asc" ? asc(sortFields[sortBy]) : desc(sortFields[sortBy]);
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(ptPatrolTaskDetails)
				.leftJoin(ptPatrolTasks, eq(ptPatrolTaskDetails.taskId, ptPatrolTasks.id))
				.where(where);
			const rows = await db
				.select({
					detailId: ptPatrolTaskDetails.id,
					taskId: ptPatrolTaskDetails.taskId,
					pointId: ptPatrolTaskDetails.pointId,
					checkInStatus: ptPatrolTaskDetails.checkInStatus,
					patrolSituation: ptPatrolTaskDetails.patrolSituation,
					patrolPhotoUrl: ptPatrolTaskDetails.patrolPhotoUrl,
					checkInTime: ptPatrolTaskDetails.checkInTime,
					gpsCoordinates: ptPatrolTaskDetails.gpsCoordinates,
					detailCreatedAt: ptPatrolTaskDetails.createTime,
					detailUpdatedAt: ptPatrolTaskDetails.updateTime,
					taskCode: ptPatrolTasks.taskCode,
					taskName: ptPatrolTasks.taskName,
					taskStatus: ptPatrolTasks.status,
					patrolMethod: ptPatrolTasks.patrolMethod,
					plannedStartTime: ptPatrolTasks.plannedStartTime,
					plannedEndTime: ptPatrolTasks.plannedEndTime,
					actualPatrolTime: ptPatrolTasks.actualPatrolTime,
					plannedPatroller: ptPatrolTasks.plannedPatroller,
					currentPatrolPerson: ptPatrolTasks.currentPatrolPerson,
					pointName: ptPatrolPoints.pointName,
					pathName: ptPatrolPaths.pathName,
					planName: ptPatrolPlans.planName,
				})
				.from(ptPatrolTaskDetails)
				.leftJoin(ptPatrolTasks, eq(ptPatrolTaskDetails.taskId, ptPatrolTasks.id))
				.leftJoin(ptPatrolPoints, eq(ptPatrolTaskDetails.pointId, ptPatrolPoints.id))
				.leftJoin(ptPatrolPaths, eq(ptPatrolPoints.pathId, ptPatrolPaths.id))
				.leftJoin(ptPatrolPlans, eq(ptPatrolPaths.planId, ptPatrolPlans.id))
				.where(where)
				.orderBy(orderBy)
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.detailId || "",
					name: item.taskName || "",
					status: item.taskStatus || "pending",
					remark: "",
					taskDetailId: item.detailId || "",
					patrolPointName: item.pointName || "",
					patrolPlanName: item.planName || "",
					patrolRouteName: item.pathName || "",
					patrolPersonStartEndTime: formatRange(item.plannedStartTime, item.plannedEndTime),
					patrolPointStartEndTime: formatDateTime(item.checkInTime),
					actualPatrolTime: formatDateTime(item.actualPatrolTime),
					actualCheckInStatus: item.checkInStatus || "not_checked",
					plannedPatrolPerson: item.plannedPatroller || "",
					actualPatrolPerson: item.currentPatrolPerson || "",
					patrolMethod: item.patrolMethod || "",
					taskStatus: item.taskStatus || "pending",
					patrolPointStatus: toPatrolPointStatus(item.checkInStatus),
					patrolSituation: item.patrolSituation || "",
					patrolPhotos: item.patrolPhotoUrl || "",
					locationInfo: item.gpsCoordinates || "",
					createTime: formatDateTime(item.detailCreatedAt),
					updateTime: formatDateTime(item.detailUpdatedAt),
				})),
			};
		},
	}) satisfies Partial<PatrolRepository>;
}

// ==========================================
// InMemory 实现
// ==========================================

class InMemoryPatrolRepository implements PatrolRepository {
	async listPatrolItems(): Promise<{ list: AdminPatrolItemListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listPatrolPaths(): Promise<{ list: AdminPatrolPathListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listPatrolPlans(): Promise<{ list: AdminPatrolPlanListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listPatrolPoints(): Promise<{ list: AdminPatrolPointListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listPatrolTasks(): Promise<{ list: AdminPatrolTaskListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listPatrolDetails(): Promise<{ list: AdminPatrolDetailListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
}

export function createInMemoryPatrolRepository(): PatrolRepository {
	return new InMemoryPatrolRepository();
}

function formatRange(
	start: Date | string | number | null | undefined,
	end: Date | string | number | null | undefined,
): string {
	const formattedStart = formatDateTime(start);
	const formattedEnd = formatDateTime(end);
	return formattedStart && formattedEnd ? `${formattedStart} ~ ${formattedEnd}` : "";
}

function toPatrolPointStatus(checkInStatus: string | null | undefined): "normal" | "abnormal" | "pending" {
	if (checkInStatus === "checked") {
		return "normal";
	}
	if (checkInStatus === "abnormal") {
		return "abnormal";
	}
	return "pending";
}
