import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { RoomUnitService } from "./service";

export const roomUnitLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-pilot",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: ["/app/room.queryRooms", "/app/room.queryRoomDetail", "/app/unit.queryUnits", "/app/unit.queryUnitDetail"],
	syntheticIdPolicy: "F_/U_/R_ compatibility seed identifiers only",
	notCovered: [
		"db-backed-room-unit-data",
		"real-room-unit-primary-keys",
		"shadow-off-fallback",
		"production-app-h5-network",
	],
} as const;

export function createLegacyRoomUnitAdapter(service: RoomUnitService) {
	return {
		async queryRooms(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listRooms({
					communityId: toString(input.communityId) || "COMM_001",
					floorId: toString(input.floorId),
					unitId: toString(input.unitId),
					roomNum: toString(input.roomNum),
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 50),
				}),
				"查询成功",
			);
		},

		async queryRoomDetail(input: Record<string, unknown>) {
			const roomId = toString(input.roomId);
			if (!roomId) {
				return legacyFailure("房间ID不能为空", 400);
			}

			const room = await service.getRoomById(roomId);
			if (!room) {
				return legacyFailure("房屋不存在", 404);
			}

			return legacySuccess(room, "查询成功");
		},

		async queryUnits(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listUnits({
					communityId: toString(input.communityId) || "COMM_001",
					floorId: toString(input.floorId),
					unitNum: toString(input.unitNum),
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
				}),
				"查询成功",
			);
		},

		async queryUnitDetail(input: Record<string, unknown>) {
			const unitId = toString(input.unitId);
			if (!unitId) {
				return legacyFailure("单元ID不能为空", 400);
			}

			const unit = await service.getUnitById(unitId);
			if (!unit) {
				return legacyFailure("单元不存在", 404);
			}

			return legacySuccess(unit, "查询成功");
		},
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? Math.floor(result) : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	return `${value}`.trim();
}
