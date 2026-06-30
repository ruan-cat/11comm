import { and, desc, eq, isNull, like, sql } from "drizzle-orm";
import { hpOwners, pkCarportApplications, pkCarports, pkOwnerVehicles, pkParkingLots } from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	AdminCarportApplyListItem,
	AdminCarportInfoListItem,
	AdminOwnerVehicleListItem,
	AdminParkingLotListItem,
	ParkingArea,
	ParkingAreaMachine,
	ParkingAreaMachineSeedItem,
	ParkingBarrierCloudVideo,
	ParkingCarInoutDetail,
	ParkingCarInoutDetailQuery,
	ParkingCarInoutPayment,
	ParkingCarInoutPaymentQuery,
	ParkingCoupon,
	ParkingOwnerCar,
	ParkingOwnerCarsQuery,
	ParkingPageResult,
	ParkingTempCarFeeOrder,
	ParkingTempCarFeeOrderQuery,
	ParkingTempCarInArea,
	ParkingTempCarsQuery,
	ListCarportApplicationsParams,
	ListCarportsParams,
	ListOwnerVehiclesParams,
	ListParkingLotsParams,
} from "./types";

export interface ParkingRepository {
	listCarportApplications: (
		params: ListCarportApplicationsParams,
	) => Promise<{ list: AdminCarportApplyListItem[]; total: number }>;
	listCarports: (params: ListCarportsParams) => Promise<{ list: AdminCarportInfoListItem[]; total: number }>;
	listOwnerVehicles: (params: ListOwnerVehiclesParams) => Promise<{ list: AdminOwnerVehicleListItem[]; total: number }>;
	listParkingLots: (params: ListParkingLotsParams) => Promise<{ list: AdminParkingLotListItem[]; total: number }>;
	listLegacyOwnerCars: (params: ParkingOwnerCarsQuery) => Promise<ParkingPageResult<ParkingOwnerCar>>;
	listLegacyParkingAreas: () => Promise<ParkingArea[]>;
	listLegacyParkingAreaMachines: (paNum?: string) => Promise<ParkingAreaMachine[]>;
	getLegacyBarrierCloudVideo: (machineId: string) => Promise<ParkingBarrierCloudVideo | undefined>;
	listLegacyTempCars: (params: ParkingTempCarsQuery) => Promise<ParkingTempCarInArea[]>;
	listLegacyParkingCoupons: () => Promise<ParkingCoupon[]>;
	getLegacyTempCarFeeOrder: (params: ParkingTempCarFeeOrderQuery) => Promise<ParkingTempCarFeeOrder>;
	listLegacyCarInoutDetails: (params: ParkingCarInoutDetailQuery) => Promise<ParkingPageResult<ParkingCarInoutDetail>>;
	listLegacyCarInoutPayments: (
		params: ParkingCarInoutPaymentQuery,
	) => Promise<ParkingPageResult<ParkingCarInoutPayment>>;
}

export function createParkingRepository(options: { db?: DbType } = {}): ParkingRepository {
	return options.db ? createDbParkingRepository(options.db) : createInMemoryParkingRepository();
}

export function createDbParkingRepository(db: DbType): ParkingRepository {
	const fallback = createInMemoryParkingRepository();

	return Object.assign(fallback, {
		async listCarportApplications(
			params: ListCarportApplicationsParams,
		): Promise<{ list: AdminCarportApplyListItem[]; total: number }> {
			const conditions = [];
			if (params.applicant) {
				conditions.push(like(pkCarportApplications.applicant, `%${params.applicant}%`));
			}
			if (params.carportType) {
				conditions.push(eq(pkCarportApplications.carportType, params.carportType));
			}
			if (params.status ?? params.reviewResult) {
				conditions.push(eq(pkCarportApplications.status, (params.status ?? params.reviewResult) as string));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(pkCarportApplications)
				.where(where);
			const rows = await db
				.select()
				.from(pkCarportApplications)
				.where(where)
				.orderBy(desc(pkCarportApplications.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					applicationId: item.id || "",
					licensePlate: "",
					parkingSpace: item.allocatedCarport || "",
					carBrand: "",
					vehicleType: item.carportType || "",
					color: "",
					startLeaseTime: "",
					endLeaseTime: "",
					applicant: item.applicant || "",
					phoneNumber: "",
					reviewResult: item.status || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		async listCarports(params: ListCarportsParams): Promise<{ list: AdminCarportInfoListItem[]; total: number }> {
			const conditions = [];
			if (params.parkingLot) {
				conditions.push(like(pkParkingLots.lotName, `%${params.parkingLot}%`));
			}
			if (params.parkingSpace) {
				conditions.push(like(pkCarports.carportNumber, `%${params.parkingSpace}%`));
			}
			if (params.parkingSpaceStatus) {
				conditions.push(eq(pkCarports.status, params.parkingSpaceStatus));
			}
			if (params.parkingSpaceType) {
				conditions.push(eq(pkCarports.carportType, params.parkingSpaceType));
			}
			if (params.ownerName) {
				conditions.push(like(pkCarports.ownerName, `%${params.ownerName}%`));
			}
			if (params.contactPhone) {
				conditions.push(like(pkCarports.contactPhone, `%${params.contactPhone}%`));
			}
			if (params.vehicleNumber) {
				conditions.push(like(pkCarports.boundVehicle, `%${params.vehicleNumber}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(pkCarports)
				.leftJoin(pkParkingLots, eq(pkCarports.parkingLotId, pkParkingLots.id))
				.where(where);
			const rows = await db
				.select({
					id: pkCarports.id,
					carportNumber: pkCarports.carportNumber,
					carportType: pkCarports.carportType,
					area: pkCarports.area,
					status: pkCarports.status,
					ownerName: pkCarports.ownerName,
					contactPhone: pkCarports.contactPhone,
					boundVehicle: pkCarports.boundVehicle,
					monthlyRent: pkCarports.monthlyRent,
					purchaseDate: pkCarports.purchaseDate,
					expiryDate: pkCarports.expiryDate,
					createTime: pkCarports.createTime,
					updateTime: pkCarports.updateTime,
					parkingLotName: pkParkingLots.lotName,
				})
				.from(pkCarports)
				.leftJoin(pkParkingLots, eq(pkCarports.parkingLotId, pkParkingLots.id))
				.where(where)
				.orderBy(desc(pkCarports.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					parkingLot: item.parkingLotName || "",
					parkingSpace: item.carportNumber || "",
					parkingSpaceStatus: item.status || "",
					parkingSpaceType: item.carportType || "",
					area: item.area || "",
					ownerName: item.ownerName || "",
					contactPhone: item.contactPhone || "",
					vehicleNumber: item.boundVehicle || "",
					purchaseDate: item.purchaseDate || "",
					expiryDate: item.expiryDate || "",
					monthlyRent: Number(item.monthlyRent || 0),
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		async listOwnerVehicles(
			params: ListOwnerVehiclesParams,
		): Promise<{ list: AdminOwnerVehicleListItem[]; total: number }> {
			const conditions = [isNull(pkOwnerVehicles.deletedAt)];
			if (params.licensePlate) {
				conditions.push(like(pkOwnerVehicles.licensePlate, `%${params.licensePlate}%`));
			}
			if (params.memberPlateNumber) {
				conditions.push(like(pkOwnerVehicles.licensePlate, `%${params.memberPlateNumber}%`));
			}
			if (params.carBrand) {
				conditions.push(like(pkOwnerVehicles.brand, `%${params.carBrand}%`));
			}
			if (params.vehicleType) {
				conditions.push(eq(pkOwnerVehicles.vehicleType, params.vehicleType));
			}
			if (params.parkingSpaceNumber) {
				conditions.push(like(pkCarports.carportNumber, `%${params.parkingSpaceNumber}%`));
			}
			if (params.parkingSpaceStatus) {
				conditions.push(eq(pkCarports.status, params.parkingSpaceStatus));
			}
			if (params.ownerName) {
				conditions.push(like(hpOwners.name, `%${params.ownerName}%`));
			}
			if (params.contactInfo) {
				conditions.push(like(hpOwners.phone, `%${params.contactInfo}%`));
			}

			const where = and(...conditions);
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(pkOwnerVehicles)
				.leftJoin(pkCarports, eq(pkOwnerVehicles.carportId, pkCarports.id))
				.leftJoin(hpOwners, eq(pkOwnerVehicles.ownerId, hpOwners.id))
				.where(where);
			const rows = await db
				.select({
					licensePlate: pkOwnerVehicles.licensePlate,
					brand: pkOwnerVehicles.brand,
					relatedHouse: pkOwnerVehicles.relatedHouse,
					plateType: pkOwnerVehicles.plateType,
					vehicleType: pkOwnerVehicles.vehicleType,
					vehicleColor: pkOwnerVehicles.vehicleColor,
					validityStart: pkOwnerVehicles.validityStart,
					validityEnd: pkOwnerVehicles.validityEnd,
					createTime: pkOwnerVehicles.createTime,
					updateTime: pkOwnerVehicles.updateTime,
					ownerName: hpOwners.name,
					carportNumber: pkCarports.carportNumber,
				})
				.from(pkOwnerVehicles)
				.leftJoin(pkCarports, eq(pkOwnerVehicles.carportId, pkCarports.id))
				.leftJoin(hpOwners, eq(pkOwnerVehicles.ownerId, hpOwners.id))
				.where(where)
				.orderBy(desc(pkOwnerVehicles.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					licensePlate: item.licensePlate || "",
					memberVehicle: item.brand || "",
					houseNumber: item.relatedHouse || "",
					licensePlateType: item.plateType || "",
					vehicleType: item.vehicleType || "",
					color: item.vehicleColor || "",
					owner: item.ownerName || "",
					parkingSpace: item.carportNumber || "",
					validityPeriod: item.validityStart && item.validityEnd ? `${item.validityStart} ~ ${item.validityEnd}` : "",
					status: "enabled",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		async listParkingLots(params: ListParkingLotsParams): Promise<{ list: AdminParkingLotListItem[]; total: number }> {
			const conditions = [];
			if (params.parkingLotNumber) {
				conditions.push(like(pkParkingLots.lotName, `%${params.parkingLotNumber}%`));
			}
			if (params.parkingLotType) {
				conditions.push(eq(pkParkingLots.lotType, params.parkingLotType));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(pkParkingLots)
				.where(where);
			const rows = await db
				.select()
				.from(pkParkingLots)
				.where(where)
				.orderBy(desc(pkParkingLots.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					parkingLotNumber: item.lotName || "",
					parkingLotType: toParkingLotType(item.lotType),
					parkingSpaceType: "standard",
					externalCode: item.id || "",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
	} satisfies Partial<ParkingRepository>);
}

class InMemoryParkingRepository implements ParkingRepository {
	private readonly legacyOwnerCars = createLegacyOwnerCarSeed();

	private readonly legacyParkingAreas = createLegacyParkingAreaSeed();

	private readonly legacyParkingMachines = createLegacyParkingMachineSeed();

	private readonly legacyTempCars = createLegacyTempCarSeed();

	private readonly legacyParkingCoupons = createLegacyParkingCouponSeed();

	private readonly legacyCarInoutDetails = createLegacyCarInoutDetailSeed();

	private readonly legacyCarInoutPayments = createLegacyCarInoutPaymentSeed();

	async listCarportApplications(): Promise<{ list: AdminCarportApplyListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listCarports(): Promise<{ list: AdminCarportInfoListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listOwnerVehicles(): Promise<{ list: AdminOwnerVehicleListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listParkingLots(): Promise<{ list: AdminParkingLotListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listLegacyOwnerCars(params: ParkingOwnerCarsQuery): Promise<ParkingPageResult<ParkingOwnerCar>> {
		const list = this.legacyOwnerCars.filter((item) => {
			const matchCarNum = !params.carNumLike || item.carNum.includes(params.carNumLike);
			const matchOwner = !params.ownerName || item.ownerName.includes(params.ownerName);
			const matchMemberCarNum = !params.memberCarNumLike || item.carNum.includes(params.memberCarNumLike);
			const matchNum = !params.num || item.num?.includes(params.num);
			const matchLink = !params.link || item.link.includes(params.link);

			return matchCarNum && matchOwner && matchMemberCarNum && matchNum && matchLink;
		});

		return createParkingPage(list, params.page, params.row);
	}

	async listLegacyParkingAreas(): Promise<ParkingArea[]> {
		return this.legacyParkingAreas.map((item) => ({ ...item }));
	}

	async listLegacyParkingAreaMachines(paNum?: string): Promise<ParkingAreaMachine[]> {
		return this.legacyParkingMachines
			.filter((item) => !paNum || item.paNum === paNum)
			.map(({ paNum: _paNum, ...machine }) => ({ ...machine }));
	}

	async getLegacyBarrierCloudVideo(machineId: string): Promise<ParkingBarrierCloudVideo | undefined> {
		const machine = this.legacyParkingMachines.find((item) => item.machineId === machineId);

		return machine ? { url: machine.videoUrl } : undefined;
	}

	async listLegacyTempCars(params: ParkingTempCarsQuery): Promise<ParkingTempCarInArea[]> {
		return this.legacyTempCars
			.filter((item) => {
				const matchCarNum = !params.carNum || item.carNum.includes(params.carNum);
				const matchParkingArea = !params.paId || item.paId === params.paId;

				return matchCarNum && matchParkingArea;
			})
			.map((item) => ({ ...item }));
	}

	async listLegacyParkingCoupons(): Promise<ParkingCoupon[]> {
		return this.legacyParkingCoupons.map((item) => ({ ...item }));
	}

	async getLegacyTempCarFeeOrder(params: ParkingTempCarFeeOrderQuery): Promise<ParkingTempCarFeeOrder> {
		const couponCount = params.pccIds ? params.pccIds.split(",").filter(Boolean).length : 0;

		return {
			amount: Number(Math.max(0, 20 - couponCount * 3).toFixed(2)),
		};
	}

	async listLegacyCarInoutDetails(
		params: ParkingCarInoutDetailQuery,
	): Promise<ParkingPageResult<ParkingCarInoutDetail>> {
		const list = this.legacyCarInoutDetails.filter((item) => !params.paNum || item.paNum === params.paNum);

		return createParkingPage(list, params.page, params.row);
	}

	async listLegacyCarInoutPayments(
		params: ParkingCarInoutPaymentQuery,
	): Promise<ParkingPageResult<ParkingCarInoutPayment>> {
		void params.paNum;

		return createParkingPage(this.legacyCarInoutPayments, params.page, params.row);
	}
}

export function createInMemoryParkingRepository(): ParkingRepository {
	return new InMemoryParkingRepository();
}

function toParkingLotType(value: string | null): AdminParkingLotListItem["parkingLotType"] {
	if (value === "地下停车场") {
		return "underground";
	}
	if (value === "立体停车场") {
		return "multi_level";
	}
	if (value === "路边停车位") {
		return "roadside";
	}
	if (value === "underground" || value === "multi_level" || value === "roadside") {
		return value;
	}
	return "ground";
}

function createParkingPage<T>(list: T[], page: number, pageSize: number): ParkingPageResult<T> {
	const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
	const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 10;
	const start = (safePage - 1) * safePageSize;
	const pageList = list.slice(start, start + safePageSize);

	return {
		list: pageList.map((item) => ({ ...(item as object) }) as T),
		total: list.length,
		page: safePage,
		pageSize: safePageSize,
		hasMore: start + safePageSize < list.length,
	};
}

function createLegacyParkingAreaSeed(): ParkingArea[] {
	return [
		{ paId: "PA_001", num: "P1", name: "Phase 1 Underground Parking" },
		{ paId: "PA_002", num: "P2", name: "Phase 2 Surface Parking" },
	];
}

function createLegacyParkingMachineSeed(): ParkingAreaMachineSeedItem[] {
	return [
		{
			machineId: "M_001",
			machineCode: "MC_001",
			machineName: "P1 Entry Barrier",
			boxId: "BOX_001",
			direction: "3306",
			status: "online",
			videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
			paNum: "P1",
		},
		{
			machineId: "M_002",
			machineCode: "MC_002",
			machineName: "P1 Exit Barrier",
			boxId: "BOX_002",
			direction: "3307",
			status: "online",
			videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
			paNum: "P1",
		},
		{
			machineId: "M_003",
			machineCode: "MC_003",
			machineName: "P2 Entry Barrier",
			boxId: "BOX_003",
			direction: "3306",
			status: "online",
			videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
			paNum: "P2",
		},
		{
			machineId: "M_004",
			machineCode: "MC_004",
			machineName: "P2 Exit Barrier",
			boxId: "BOX_004",
			direction: "3307",
			status: "online",
			videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
			paNum: "P2",
		},
	];
}

function createLegacyTempCarSeed(): ParkingTempCarInArea[] {
	return [
		{ inoutId: "IO_0001", paId: "PA_001", carNum: "B12345", payCharge: 0, hours: 2, min: 10 },
		{ inoutId: "IO_0002", paId: "PA_001", carNum: "B88888", payCharge: 18, hours: 2, min: 45 },
		{ inoutId: "IO_0003", paId: "PA_002", carNum: "B34567", payCharge: 12, hours: 1, min: 30 },
	];
}

function createLegacyParkingCouponSeed(): ParkingCoupon[] {
	return [
		{ pccId: "PCC_001", couponName: "Parking Coupon A", typeCd: "2002", value: 5, state: "1001" },
		{ pccId: "PCC_002", couponName: "Parking Coupon B", typeCd: "1001", value: 30, state: "1001" },
		{ pccId: "PCC_003", couponName: "Parking Coupon C", typeCd: "3003", value: 8, state: "1001" },
	];
}

function createLegacyCarInoutDetailSeed(): ParkingCarInoutDetail[] {
	return [
		{
			inoutId: "IOD_0001",
			carNum: "B12345",
			stateName: "Paid",
			paNum: "P1",
			carTypeName: "Temporary Car",
			inTime: "2026-06-07 08:10:00",
			openTime: "2026-06-07 10:20:00",
			payCharge: 0,
			hours: 2,
			min: 10,
			remark: "Temporary car free exit",
			photoJpg: "https://example.test/parking/IOD_0001.jpg",
		},
		{
			inoutId: "IOD_0002",
			carNum: "B88888",
			stateName: "Paid",
			paNum: "P1",
			carTypeName: "Temporary Car",
			inTime: "2026-06-07 09:00:00",
			openTime: "2026-06-07 11:45:00",
			payCharge: 18,
			hours: 2,
			min: 45,
			remark: "Manual release after payment",
		},
		{
			inoutId: "IOD_0003",
			carNum: "B34567",
			stateName: "Unpaid",
			paNum: "P2",
			carTypeName: "Temporary Car",
			inTime: "2026-06-07 09:30:00",
			payCharge: 12,
			hours: 1,
			min: 30,
			remark: "Awaiting payment",
			photoJpg: "https://example.test/parking/IOD_0003.jpg",
		},
	];
}

function createLegacyCarInoutPaymentSeed(): ParkingCarInoutPayment[] {
	return [
		{
			inoutId: "IOP_0001",
			carNum: "B12345",
			stateName: "Paid",
			inTime: "2026-06-07 08:10:00",
			createTime: "2026-06-07 10:20:00",
			payTypeName: "Cash",
			payCharge: 0,
			realCharge: 0,
		},
		{
			inoutId: "IOP_0002",
			carNum: "B88888",
			stateName: "Paid",
			inTime: "2026-06-07 09:00:00",
			createTime: "2026-06-07 11:45:00",
			payTypeName: "WeChat Pay",
			payCharge: 18,
			realCharge: 18,
		},
		{
			inoutId: "IOP_0003",
			carNum: "B34567",
			stateName: "Paid",
			inTime: "2026-06-07 09:30:00",
			createTime: "2026-06-07 11:00:00",
			payTypeName: "Alipay",
			payCharge: 12,
			realCharge: 12,
		},
	];
}

function createLegacyOwnerCarSeed(): ParkingOwnerCar[] {
	return [
		{
			carId: "CAR_0001",
			carNum: "B12345",
			ownerName: "Zhang San",
			link: "13800000001",
			roomName: "Building 1 Room 101",
			areaNum: "P1",
			num: "P-001",
			state: "1001",
			stateName: "Normal",
			leaseType: "H",
			leaseTypeName: "Monthly",
			startTime: "2026-01-01 00:00:00",
			endTime: "2026-12-31 23:59:59",
		},
		{
			carId: "CAR_0002",
			carNum: "B23456",
			ownerName: "Li Si",
			link: "13800000002",
			roomName: "Building 2 Room 202",
			areaNum: "P1",
			num: "P-002",
			state: "1001",
			stateName: "Normal",
			leaseType: "H",
			leaseTypeName: "Monthly",
			startTime: "2026-02-01 00:00:00",
			endTime: "2026-12-31 23:59:59",
		},
		{
			carId: "CAR_0003",
			carNum: "B34567",
			ownerName: "Wang Wu",
			link: "13800000003",
			roomName: "Building 3 Room 303",
			areaNum: "P2",
			num: "P-003",
			state: "2000",
			stateName: "Released",
			leaseType: "T",
			leaseTypeName: "Temporary",
			startTime: "2026-03-01 00:00:00",
			endTime: "2026-06-30 23:59:59",
		},
	];
}
