import { formatDateTime } from "../../utils/format-date";
import type {
	FeeConfigItem,
	FeeTypeItem,
	FloorShareMeter,
	FloorShareMeterQuery,
	FloorShareReading,
	FloorShareReadingQuery,
	MeterPaginationResult,
	MeterReading,
	MeterReadingQuery,
	MeterTypeItem,
	PreMeterWaterQuery,
	PreMeterWaterResult,
} from "./types";

export interface MeterRepository {
	listFeeTypes(): Promise<FeeTypeItem[]>;
	listFeeConfigItems(feeTypeCd: string): Promise<FeeConfigItem[]>;
	listMeterTypes(): Promise<MeterTypeItem[]>;
	listMeterReadings(query: MeterReadingQuery): Promise<MeterPaginationResult<MeterReading>>;
	getPreMeterWater(query: PreMeterWaterQuery): Promise<PreMeterWaterResult>;
	listFloorShareReadings(query: FloorShareReadingQuery): Promise<MeterPaginationResult<FloorShareReading>>;
	listFloorShareMeters(query: FloorShareMeterQuery): Promise<MeterPaginationResult<FloorShareMeter>>;
}

const feeTypes: FeeTypeItem[] = [
	{ id: "888800010015", name: "水费" },
	{ id: "888800010016", name: "电费" },
	{ id: "888800010009", name: "燃气费" },
];

const feeConfigsMap: Record<string, FeeConfigItem[]> = {
	888800010015: [
		{ configId: "CFG_WATER_001", feeName: "居民生活用水" },
		{ configId: "CFG_WATER_002", feeName: "商业用水" },
	],
	888800010016: [
		{ configId: "CFG_POWER_001", feeName: "居民生活用电" },
		{ configId: "CFG_POWER_002", feeName: "公共照明用电" },
	],
	888800010009: [{ configId: "CFG_GAS_001", feeName: "居民燃气" }],
};

const meterTypes: MeterTypeItem[] = [
	{ typeId: "1010", typeName: "电表" },
	{ typeId: "2020", typeName: "水表" },
	{ typeId: "3030", typeName: "燃气表" },
];

const meterSeedBaseTime = Date.UTC(2026, 5, 6, 8, 0, 0);

const meterReadings: MeterReading[] = Array.from({ length: 60 }, (_, index) => {
	const meterType = meterTypes[index % meterTypes.length];
	const floor = (index % 12) + 1;
	const unit = (index % 4) + 1;
	const room = String((index % 24) + 1).padStart(2, "0");
	const pre = 100 + index * 3;
	const cur = pre + 8 + (index % 5);

	return {
		readingId: `MR_${String(index + 1).padStart(5, "0")}`,
		objId: `ROOM_${String(index + 1).padStart(4, "0")}`,
		objName: `${floor}-${unit}-${room}`,
		meterType: meterType.typeId,
		meterTypeName: meterType.typeName,
		preDegrees: pre,
		curDegrees: cur,
		preReadingTime: formatDateTime(meterSeedBaseTime - (index + 2) * 86400000),
		curReadingTime: formatDateTime(meterSeedBaseTime - (index + 1) * 86400000),
		remark: "系统抄表记录",
	};
});

const floorShareMeters: FloorShareMeter[] = Array.from({ length: 16 }, (_, index) => {
	const meterType = meterTypes[index % 2];

	return {
		fsmId: `FSM_${String(index + 1).padStart(4, "0")}`,
		floorNum: `${(index % 8) + 1}`,
		meterNum: `GSB-${String(index + 11).padStart(3, "0")}`,
		meterType: meterType.typeId,
		meterTypeName: meterType.typeName,
		curDegree: 1200 + index * 11,
		curReadingTime: formatDateTime(meterSeedBaseTime - index * 86400000),
	};
});

const floorShareReadings: FloorShareReading[] = Array.from({ length: 28 }, (_, index) => {
	const meter = floorShareMeters[index % floorShareMeters.length];
	const pre = meter.curDegree + index;
	const cur = pre + 12 + (index % 6);
	const state: FloorShareReading["state"] = index % 4 === 0 ? "W" : "C";

	return {
		readingId: `FSR_${String(index + 1).padStart(4, "0")}`,
		fsmId: meter.fsmId,
		floorNum: meter.floorNum,
		meterTypeName: meter.meterTypeName,
		preDegrees: pre,
		curDegrees: cur,
		preReadingTime: formatDateTime(meterSeedBaseTime - (index + 2) * 86400000),
		curReadingTime: formatDateTime(meterSeedBaseTime - (index + 1) * 86400000),
		state,
		stateName: state === "W" ? "待审核" : "已通过",
		auditRemark: state === "W" ? "" : "审核通过",
	};
});

export function createMeterRepository(): MeterRepository {
	return {
		async listFeeTypes() {
			return cloneValue(feeTypes);
		},

		async listFeeConfigItems(feeTypeCd) {
			return cloneValue(feeConfigsMap[feeTypeCd] ?? []);
		},

		async listMeterTypes() {
			return cloneValue(meterTypes);
		},

		async listMeterReadings(query) {
			const roomNum = query.roomNum?.trim();
			const list = roomNum ? meterReadings.filter((item) => item.objName.includes(roomNum)) : meterReadings;

			return createPaginationResponse(list, query.page, query.row);
		},

		async getPreMeterWater(query) {
			const found = meterReadings.find((item) => item.objId === query.objId && item.meterType === query.meterType);

			return cloneValue({
				curDegrees: found?.curDegrees ?? 0,
				curReadingTime: found?.curReadingTime ?? formatDateTime(meterSeedBaseTime),
			});
		},

		async listFloorShareReadings(query) {
			return createPaginationResponse(floorShareReadings, query.page, query.row);
		},

		async listFloorShareMeters(query) {
			const fsmId = query.fsmId?.trim();
			const list = fsmId ? floorShareMeters.filter((item) => item.fsmId === fsmId) : floorShareMeters;

			return createPaginationResponse(list, query.page, query.row);
		},
	};
}

function createPaginationResponse<T>(data: T[], page = 1, pageSize = 10): MeterPaginationResult<T> {
	const start = (page - 1) * pageSize;
	const end = start + pageSize;

	return cloneValue({
		list: data.slice(start, end),
		total: data.length,
		page,
		pageSize,
		hasMore: end < data.length,
	});
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
