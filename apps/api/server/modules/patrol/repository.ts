import { and, desc, eq, like, sql } from "drizzle-orm";
import { ptPatrolItems, ptPatrolPaths, ptPatrolPlans, ptPatrolPoints } from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	AdminPatrolItemListItem,
	AdminPatrolPathListItem,
	AdminPatrolPlanListItem,
	AdminPatrolPointListItem,
	ListPatrolItemsParams,
	ListPatrolPathsParams,
	ListPatrolPlansParams,
	ListPatrolPointsParams,
} from "./types";

export interface PatrolRepository {
	listPatrolItems: (params: ListPatrolItemsParams) => Promise<{ list: AdminPatrolItemListItem[]; total: number }>;
	listPatrolPaths: (params: ListPatrolPathsParams) => Promise<{ list: AdminPatrolPathListItem[]; total: number }>;
	listPatrolPlans: (params: ListPatrolPlansParams) => Promise<{ list: AdminPatrolPlanListItem[]; total: number }>;
	listPatrolPoints: (params: ListPatrolPointsParams) => Promise<{ list: AdminPatrolPointListItem[]; total: number }>;
}

export function createPatrolRepository(options: { db?: DbType } = {}): PatrolRepository {
	return options.db ? createDbPatrolRepository(options.db) : createInMemoryPatrolRepository();
}

export function createDbPatrolRepository(db: DbType): PatrolRepository {
	const fallback = createInMemoryPatrolRepository();

	return Object.assign(fallback, {
		// ---- item/list ----
		async listPatrolItems(params: ListPatrolItemsParams): Promise<{ list: AdminPatrolItemListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
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
			const conditions: ReturnType<typeof eq>[] = [];
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
			const conditions: ReturnType<typeof eq>[] = [];
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
			const conditions: ReturnType<typeof eq>[] = [];
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
}

export function createInMemoryPatrolRepository(): PatrolRepository {
	return new InMemoryPatrolRepository();
}
