import type { FloorService } from "./service";
import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";

export function createLegacyFloorAdapter(service: FloorService) {
	return {
		async listFloors(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 50);
			const communityId = toString(input.communityId) || "COMM_001";
			const floorNum = toString(input.floorNum);
			const keyword = toString(input.keyword);

			const result = await service.listFloors({
				communityId,
				floorNum,
				keyword,
				page,
				row,
			});

			return legacySuccess(result, "查询楼层列表成功");
		},
		async queryFloorDetail(input: Record<string, unknown>) {
			const floorId = toString(input.floorId);
			if (!floorId) {
				return legacyFailure("楼层ID不能为空", 400);
			}
			const floor = await service.getFloorById(floorId);
			if (!floor) {
				return legacyFailure("楼层不存在", 404);
			}
			return legacySuccess(floor, "查询楼层详情成功");
		},
	};
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
