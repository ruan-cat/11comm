import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { adminSuccess } from "../../shared/runtime/response-builder";
import type { PatrolService } from "./service";
import type {
	AdminPatrolItemListItem,
	AdminPatrolPathListItem,
	AdminPatrolPlanListItem,
	AdminPatrolPointListItem,
} from "./types";

export function createAdminPatrolAdapter(service: PatrolService) {
	return {
		// ---- item/list ----
		async listPatrolItems(input: {
			pageIndex?: number;
			pageSize?: number;
			itemName?: string;
		}): Promise<JsonVO<PageDTO<AdminPatrolItemListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPatrolItems({
				pageIndex,
				pageSize,
				itemName: blankToUndefined(input.itemName),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		// ---- path/list ----
		async listPatrolPaths(input: {
			pageIndex?: number;
			pageSize?: number;
			pathName?: string;
			planId?: string;
		}): Promise<JsonVO<PageDTO<AdminPatrolPathListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPatrolPaths({
				pageIndex,
				pageSize,
				pathName: blankToUndefined(input.pathName),
				planId: blankToUndefined(input.planId),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		// ---- plan/list ----
		async listPatrolPlans(input: {
			pageIndex?: number;
			pageSize?: number;
			planName?: string;
			patrolType?: string;
		}): Promise<JsonVO<PageDTO<AdminPatrolPlanListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPatrolPlans({
				pageIndex,
				pageSize,
				planName: blankToUndefined(input.planName),
				patrolType: blankToUndefined(input.patrolType),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		// ---- point/list ----
		async listPatrolPoints(input: {
			pageIndex?: number;
			pageSize?: number;
			pointName?: string;
			pathId?: string;
		}): Promise<JsonVO<PageDTO<AdminPatrolPointListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPatrolPoints({
				pageIndex,
				pageSize,
				pointName: blankToUndefined(input.pointName),
				pathId: blankToUndefined(input.pathId),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function blankToUndefined(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
