import type {
	CarportApplyListItem,
	CarportInfoListItem,
	OwnerVehicleListItem,
	ParkingLotListItem,
} from "@01s-11comm/type";

export type AdminCarportApplyListItem = CarportApplyListItem;
export type AdminCarportInfoListItem = CarportInfoListItem;
export type AdminOwnerVehicleListItem = OwnerVehicleListItem;
export type AdminParkingLotListItem = ParkingLotListItem;

export interface ListCarportApplicationsParams {
	pageIndex: number;
	pageSize: number;
	applicant?: string;
	carportType?: string;
	status?: string;
	licensePlate?: string;
	carBrand?: string;
	phoneNumber?: string;
	reviewResult?: string;
}

export interface ListCarportsParams {
	pageIndex: number;
	pageSize: number;
	parkingLot?: string;
	parkingSpace?: string;
	parkingSpaceStatus?: string;
	parkingSpaceType?: string;
	ownerName?: string;
	contactPhone?: string;
	vehicleNumber?: string;
}

export interface ListOwnerVehiclesParams {
	pageIndex: number;
	pageSize: number;
	licensePlate?: string;
	parkingSpaceNumber?: string;
	parkingSpaceStatus?: string;
	ownerName?: string;
	contactInfo?: string;
	memberPlateNumber?: string;
	carBrand?: string;
	vehicleType?: string;
}

export interface ListParkingLotsParams {
	pageIndex: number;
	pageSize: number;
	parkingLotNumber?: string;
	parkingLotType?: string;
	parkingSpaceType?: string;
}

export interface ParkingOwnerCar {
	carId: string;
	carNum: string;
	ownerName: string;
	link: string;
	roomName?: string;
	areaNum?: string;
	num?: string;
	state: string;
	stateName: string;
	leaseType: string;
	leaseTypeName: string;
	startTime?: string;
	endTime?: string;
}

export interface ParkingArea {
	paId: string;
	num: string;
	name: string;
}

export interface ParkingAreaMachine {
	machineId: string;
	machineCode: string;
	machineName: string;
	boxId: string;
	direction: "3306" | "3307";
	status: string;
	videoUrl: string;
}

export interface ParkingAreaMachineSeedItem extends ParkingAreaMachine {
	paNum: string;
}

export interface ParkingBarrierCloudVideo {
	url: string;
}

export interface ParkingTempCarInArea {
	inoutId: string;
	paId: string;
	carNum: string;
	payCharge: number;
	hours: number;
	min: number;
}

export interface ParkingCarInoutDetail {
	inoutId: string;
	carNum: string;
	stateName: string;
	paNum: string;
	carTypeName: string;
	inTime: string;
	openTime?: string;
	payCharge: number;
	hours: number;
	min: number;
	remark: string;
	photoJpg?: string;
}

export interface ParkingCarInoutPayment {
	inoutId: string;
	carNum: string;
	stateName: string;
	inTime: string;
	createTime: string;
	payTypeName: string;
	payCharge: number;
	realCharge: number;
}

export interface ParkingCoupon {
	pccId: string;
	couponName: string;
	typeCd: "1001" | "2002" | "3003" | "4004";
	value: number;
	state: "1001" | "2000";
}

export interface ParkingTempCarFeeOrder {
	amount: number;
}

export interface ParkingPageResult<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface ParkingLegacyResponse<T> {
	success: boolean;
	code: string;
	message: string;
	data: T;
	timestamp: number;
}

export interface ParkingOwnerCarsQuery {
	page: number;
	row: number;
	carNumLike?: string;
	ownerName?: string;
	memberCarNumLike?: string;
	num?: string;
	link?: string;
}

export interface ParkingTempCarsQuery {
	carNum?: string;
	paId?: string;
}

export interface ParkingTempCarFeeOrderQuery {
	pccIds?: string;
}

export interface ParkingCarInoutDetailQuery {
	page: number;
	row: number;
	paNum?: string;
}

export interface ParkingCarInoutPaymentQuery {
	page: number;
	row: number;
	paNum?: string;
}
