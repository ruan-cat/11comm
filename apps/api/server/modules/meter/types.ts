export interface FeeTypeItem {
	id: string;
	name: string;
}

export interface FeeConfigItem {
	configId: string;
	feeName: string;
}

export interface MeterTypeItem {
	typeId: string;
	typeName: string;
}

export interface MeterPaginationQuery {
	page: number;
	row: number;
}

export interface MeterPaginationResult<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface MeterReading {
	readingId: string;
	objId: string;
	objName: string;
	meterType: string;
	meterTypeName: string;
	preDegrees: number;
	curDegrees: number;
	preReadingTime: string;
	curReadingTime: string;
	remark?: string;
}

export interface MeterReadingQuery extends MeterPaginationQuery {
	roomNum?: string;
}

export interface PreMeterWaterQuery {
	objId: string;
	meterType: string;
}

export interface PreMeterWaterResult {
	curDegrees: number;
	curReadingTime: string;
}

export interface FloorShareMeter {
	fsmId: string;
	floorNum: string;
	meterNum: string;
	meterType: string;
	meterTypeName: string;
	curDegree: number;
	curReadingTime: string;
}

export interface FloorShareMeterQuery extends MeterPaginationQuery {
	fsmId?: string;
}

export interface FloorShareReading {
	readingId: string;
	fsmId: string;
	floorNum: string;
	meterTypeName: string;
	preDegrees: number;
	curDegrees: number;
	preReadingTime: string;
	curReadingTime: string;
	state: "W" | "C" | "F";
	stateName: string;
	auditRemark?: string;
}

export interface FloorShareReadingQuery extends MeterPaginationQuery {}
