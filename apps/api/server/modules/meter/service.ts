import type { MeterRepository } from "./repository";

export interface MeterService {
	listFeeTypes(): ReturnType<MeterRepository["listFeeTypes"]>;
	listFeeConfigItems(feeTypeCd: string): ReturnType<MeterRepository["listFeeConfigItems"]>;
	listMeterTypes(): ReturnType<MeterRepository["listMeterTypes"]>;
	listMeterReadings(
		query: Parameters<MeterRepository["listMeterReadings"]>[0],
	): ReturnType<MeterRepository["listMeterReadings"]>;
	getPreMeterWater(
		query: Parameters<MeterRepository["getPreMeterWater"]>[0],
	): ReturnType<MeterRepository["getPreMeterWater"]>;
	listFloorShareReadings(
		query: Parameters<MeterRepository["listFloorShareReadings"]>[0],
	): ReturnType<MeterRepository["listFloorShareReadings"]>;
	listFloorShareMeters(
		query: Parameters<MeterRepository["listFloorShareMeters"]>[0],
	): ReturnType<MeterRepository["listFloorShareMeters"]>;
}

export function createMeterService(repository: MeterRepository): MeterService {
	return {
		listFeeTypes: () => repository.listFeeTypes(),
		listFeeConfigItems: (feeTypeCd) => repository.listFeeConfigItems(feeTypeCd),
		listMeterTypes: () => repository.listMeterTypes(),
		listMeterReadings: (query) => repository.listMeterReadings(query),
		getPreMeterWater: (query) => repository.getPreMeterWater(query),
		listFloorShareReadings: (query) => repository.listFloorShareReadings(query),
		listFloorShareMeters: (query) => repository.listFloorShareMeters(query),
	};
}
