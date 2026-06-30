import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { OwnerService } from "./service";

export const ownerLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/owner.queryOwnerAndMembers"],
	guardedEndpoints: ["/app/owner.saveRoomOwner", "/app/owner.editOwner", "/app/owner.deleteOwner"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-owner-data", "owner-write-read-back-rollback", "production-app-h5-owner-network"],
} as const;

export function createLegacyOwnerAdapter(service: OwnerService) {
	return {
		async queryOwnerAndMembers(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listOwners({
					communityId: toString(input.communityId) ?? "COMM_001",
					page: toNumber(input.page, 1, 100),
					row: toNumber(input.row, 10, 100),
					memberId: toString(input.memberId),
					name: toString(input.name),
					link: toString(input.link),
					roomName: toString(input.roomName),
				}),
				"query success",
			);
		},

		async saveRoomOwner(input: Record<string, unknown>) {
			return guarded(service, "/app/owner.saveRoomOwner", input);
		},

		async editOwner(input: Record<string, unknown>) {
			return guarded(service, "/app/owner.editOwner", input);
		},

		async deleteOwner(input: Record<string, unknown>) {
			return guarded(service, "/app/owner.deleteOwner", input);
		},
	};
}

async function guarded(service: OwnerService, endpoint: string, input: Record<string, unknown>) {
	const decision = await service.getWriteGuardDecision(endpoint, input);
	return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
}

function toNumber(value: unknown, fallback: number, max: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? Math.min(result, max) : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	return `${value}`.trim();
}
