import { and, desc, eq, isNull, like, sql } from "drizzle-orm";
import { hpOwners, pkCarportApplications, pkCarports, pkOwnerVehicles, pkParkingLots } from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	AdminCarportApplyListItem,
	AdminCarportInfoListItem,
	AdminOwnerVehicleListItem,
	AdminParkingLotListItem,
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
