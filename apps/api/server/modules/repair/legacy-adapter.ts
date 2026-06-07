import type { RepairService } from "./service";
import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";

export const repairLegacyAdapterEvidence = {
	scope: "phase4a-minimal-plus-phase7-readonly-and-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-db-read-fallback-mixed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/ownerRepair.listOwnerRepairs",
		"/app/ownerRepair.queryOwnerRepair",
		"/app/repairSetting.listRepairSettings",
		"/app/dict.queryRepairStates",
		"/callComponent/core/list",
		"/app/dict.queryPayTypes",
		"/app/ownerRepair.getRepairStatistics",
		"/app/ownerRepair.listRepairStaffRecords",
		"/app/ownerRepair.listRepairStaffs",
		"/app/repair.listRepairTypeUsers",
		"/app/resourceStore.listResources",
	],
	guardedEndpoints: ["/app/ownerRepair.saveOwnerRepair", "/callComponent/ownerRepair.appraiseRepair"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: [
		"/app/ownerRepair.updateOwnerRepair",
		"/app/ownerRepair.repairDispatch",
		"/app/ownerRepair.repairFinish",
		"/app/ownerRepair.repairEnd",
		"/app/ownerRepair.repairStart",
		"/app/ownerRepair.repairStop",
		"/app/ownerRepair.grabbingRepair",
		"/app/repair.replyRepairAppraise",
		"db-backed-repair-statistics-data",
		"production-app-h5-repair-network",
	],
} as const;

export function createLegacyRepairAdapter(service: RepairService) {
	return {
		async listOwnerRepairs(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const result = await service.listOwnerRepairs({
				page,
				row,
				communityId: toString(input.communityId) || "COMM_001",
				keyword: toString(input.keyword),
				statusCd: toString(input.statusCd || input.status),
				repairType: toString(input.repairType),
			});
			return legacySuccess({ ownerRepairs: result.list, total: result.total, page, row }, "query success");
		},
		async queryOwnerRepair(input: Record<string, unknown>) {
			const repairId = toString(input.repairId);
			if (!repairId) {
				return legacyFailure("repairId is required", 400);
			}
			const repair = await service.getOwnerRepair({ repairId });
			return repair ? legacySuccess({ ownerRepair: repair }, "query success") : legacyFailure("repair not found", 404);
		},
		async saveOwnerRepair(input: Record<string, unknown>) {
			if (!isLegacyMutationAllowed()) {
				return legacyMutationGuarded("ownerRepair.saveOwnerRepair");
			}

			if (!toString(input.title)) {
				return legacyFailure("title is required", 400);
			}
			if (!toString(input.context)) {
				return legacyFailure("context is required", 400);
			}
			const created = await service.createOwnerRepair({
				title: toString(input.title),
				context: toString(input.context),
				repairName: toString(input.repairName),
				tel: toString(input.tel),
				address: toString(input.address),
				repairType: toString(input.repairType),
				communityId: toString(input.communityId) || "COMM_001",
			});
			return legacySuccess({ ownerRepair: created }, "create success");
		},
		async listRepairSettings(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listRepairSettings({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					publicArea: toString(input.publicArea),
				}),
				"query success",
			);
		},
		async listRepairStates() {
			return legacySuccess(await service.listRepairStates(), "query success");
		},
		async listPayTypes(_input: Record<string, unknown>) {
			return legacySuccess(await service.listPayTypes(), "查询成功");
		},
		async getRepairStatistics(_input: Record<string, unknown>) {
			return legacySuccess(await service.getRepairStatistics(), "获取统计数据成功");
		},
		async listRepairStaffRecords(input: Record<string, unknown>) {
			const repairId = toString(input.repairId);
			if (!repairId) {
				return legacyFailure("维修工单ID不能为空", 400);
			}
			const repair = await service.getOwnerRepair({ repairId });
			if (!repair) {
				return legacyFailure("维修工单不存在", 404);
			}
			return legacySuccess({ staffRecords: await service.listRepairStaffRecords(repairId) }, "查询成功");
		},
		async listRepairStaffs(input: Record<string, unknown>) {
			const staffs = await service.listRepairStaffs(toString(input.repairType));
			return legacySuccess({ staffs }, "查询成功");
		},
		async listRepairTypeUsers(input: Record<string, unknown>) {
			const users = await service.listRepairTypeUsers(toString(input.repairType));
			return legacySuccess({ users }, "查询成功");
		},
		async listResources(input: Record<string, unknown>) {
			return legacySuccess(await service.listResources(toString(input.rstId)), "查询成功");
		},
		async listCoreDict(input: Record<string, unknown>) {
			const name = toString(input.name);
			const type = toString(input.type);
			const domain = toString(input.domain);
			const result = await service.listCoreDict({ name, type, domain });
			return domain
				? legacySuccess({ list: result, data: result }, "query success")
				: legacySuccess(result, "query success");
		},
		async appraiseRepair(input: Record<string, unknown>) {
			if (!isLegacyMutationAllowed()) {
				return legacyMutationGuarded("callComponent/ownerRepair.appraiseRepair");
			}
			const repairId = toString(input.repairId);
			if (!repairId) {
				return legacyFailure("repairId is required", 400);
			}
			const context = toString(input.context);
			if (!context) {
				return legacyFailure("context is required", 400);
			}
			const result = await service.appraiseRepair({ repairId, context });
			if (!result) {
				return legacyFailure("repair not found", 404);
			}
			return legacySuccess(result, "评价成功");
		},
	};
}

function isLegacyMutationAllowed(): boolean {
	return process.env.PHASE7_ALLOW_LEGACY_MUTATIONS === "1";
}

function legacyMutationGuarded(action: string) {
	return legacyFailure(
		`Phase7 mutation guard blocked ${action}; set PHASE7_ALLOW_LEGACY_MUTATIONS=1 only for controlled rollback evidence runs.`,
		409,
		{ errorCode: "PHASE7_MUTATION_GUARDED" },
	);
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
