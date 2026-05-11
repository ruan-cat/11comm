import { and, desc, eq, like, sql } from "drizzle-orm";
import {
	cmBuildingStructures,
	cmCommunities,
	cmHandingBusiness,
	cmHouseDecorations,
	cmNotices,
	cmPropertyRegisters,
	pkCarports,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	BuildingSpaceStructureDiagramListItem,
	HandingBusinessListItem,
	HouseDecorationListItem,
	ListBuildingSpaceStructureDiagramsParams,
	ListHandingBusinessesParams,
	ListHouseDecorationsParams,
	ListMyCommunitiesParams,
	ListNoticesParams,
	ListParkingSpaceStructureDiagramsParams,
	ListPropertyRegistersParams,
	MyCommunityListItem,
	NoticeListItem,
	ParkingSpaceStructureDiagramListItem,
	PropertyRegisterListItem,
} from "./types";

export interface CommunityRepository {
	listBuildingSpaceStructures: (
		params: ListBuildingSpaceStructureDiagramsParams,
	) => Promise<{ list: BuildingSpaceStructureDiagramListItem[]; total: number }>;
	listHandingBusinesses: (
		params: ListHandingBusinessesParams,
	) => Promise<{ list: HandingBusinessListItem[]; total: number }>;
	listHouseDecorations: (
		params: ListHouseDecorationsParams,
	) => Promise<{ list: HouseDecorationListItem[]; total: number }>;
	listMyCommunities: (params: ListMyCommunitiesParams) => Promise<{ list: MyCommunityListItem[]; total: number }>;
	listNotices: (params: ListNoticesParams) => Promise<{ list: NoticeListItem[]; total: number }>;
	listParkingSpaceStructures: (
		params: ListParkingSpaceStructureDiagramsParams,
	) => Promise<{ list: ParkingSpaceStructureDiagramListItem[]; total: number }>;
	listPropertyRegisters: (
		params: ListPropertyRegistersParams,
	) => Promise<{ list: PropertyRegisterListItem[]; total: number }>;
}

export function createCommunityRepository(options: { db?: DbType } = {}): CommunityRepository {
	return options.db ? createDbCommunityRepository(options.db) : createInMemoryCommunityRepository();
}

export function createInMemoryCommunityRepository(): CommunityRepository {
	return new InMemoryCommunityRepository();
}

export function createDbCommunityRepository(db: DbType): CommunityRepository {
	const fallback = createInMemoryCommunityRepository();

	return Object.assign(fallback, {
		async listBuildingSpaceStructures(params: ListBuildingSpaceStructureDiagramsParams) {
			const conditions = [];
			if (params.communityId) {
				conditions.push(eq(cmBuildingStructures.communityId, params.communityId));
			}
			if (params.buildingNo) {
				conditions.push(like(cmBuildingStructures.buildingNo, `%${params.buildingNo}%`));
			}
			if (params.floorCount !== undefined) {
				conditions.push(eq(cmBuildingStructures.floorCount, params.floorCount));
			}
			if (params.unitCount !== undefined) {
				conditions.push(eq(cmBuildingStructures.unitCount, params.unitCount));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(cmBuildingStructures)
				.where(where);
			const rows = await db
				.select()
				.from(cmBuildingStructures)
				.where(where)
				.orderBy(desc(cmBuildingStructures.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					communityId: item.communityId || "",
					buildingNo: item.buildingNo || "",
					floorCount: item.floorCount || 0,
					unitCount: item.unitCount || 0,
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		async listHandingBusinesses(params: ListHandingBusinessesParams) {
			const conditions = [];
			if (params.businessName) {
				conditions.push(like(cmHandingBusiness.businessType, `%${params.businessName}%`));
			}
			if (params.handler) {
				conditions.push(like(cmHandingBusiness.applicant, `%${params.handler}%`));
			}
			if (params.status) {
				conditions.push(eq(cmHandingBusiness.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(cmHandingBusiness)
				.where(where);
			const rows = await db
				.select()
				.from(cmHandingBusiness)
				.where(where)
				.orderBy(desc(cmHandingBusiness.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					businessType: item.businessType || "",
					applicant: item.applicant || "",
					contactPhone: item.contactPhone || "",
					status: item.status || "",
					handleTime: formatDateTime(item.handleTime),
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		async listHouseDecorations(params: ListHouseDecorationsParams) {
			const conditions = [];
			if (params.houseId) {
				conditions.push(like(cmHouseDecorations.houseNumber, `%${params.houseId}%`));
			}
			if (params.applicant) {
				conditions.push(like(cmHouseDecorations.ownerInfo, `%${params.applicant}%`));
			}
			if (params.status) {
				conditions.push(eq(cmHouseDecorations.auditStatus, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(cmHouseDecorations)
				.where(where);
			const rows = await db
				.select()
				.from(cmHouseDecorations)
				.where(where)
				.orderBy(desc(cmHouseDecorations.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					houseNumber: item.houseNumber || "",
					ownerInfo: item.ownerInfo || "",
					decorationCompany: item.decorationCompany || "",
					plannedStartTime: item.plannedStartTime || "",
					plannedEndTime: item.plannedEndTime || "",
					auditStatus: item.auditStatus || "pending",
					auditor: item.auditor || "",
					auditTime: formatDateTime(item.auditTime),
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		async listMyCommunities(params: ListMyCommunitiesParams) {
			const conditions = [];
			if (params.province) {
				conditions.push(eq(cmCommunities.province, params.province));
			}
			if (params.city) {
				conditions.push(eq(cmCommunities.city, params.city));
			}
			if (params.district) {
				conditions.push(eq(cmCommunities.district, params.district));
			}
			if (params.communityName) {
				conditions.push(like(cmCommunities.name, `%${params.communityName}%`));
			}
			if (params.communityCode) {
				conditions.push(like(cmCommunities.code, `%${params.communityCode}%`));
			}
			if (params.status) {
				conditions.push(eq(cmCommunities.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(cmCommunities)
				.where(where);
			const rows = await db
				.select()
				.from(cmCommunities)
				.where(where)
				.orderBy(desc(cmCommunities.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					name: item.name || "",
					code: item.code || "",
					address: item.address || "",
					phone: item.phone || "",
					status: item.status || "enabled",
					province: item.province || "",
					city: item.city || "",
					district: item.district || "",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		async listNotices(params: ListNoticesParams) {
			const conditions = [];
			if (params.title) {
				conditions.push(like(cmNotices.title, `%${params.title}%`));
			}
			if (params.publisher) {
				conditions.push(like(cmNotices.publisher, `%${params.publisher}%`));
			}
			if (params.status) {
				conditions.push(eq(cmNotices.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(cmNotices)
				.where(where);
			const rows = await db
				.select()
				.from(cmNotices)
				.where(where)
				.orderBy(desc(cmNotices.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					communityId: item.communityId || "",
					title: item.title || "",
					content: item.content || "",
					publishTime: formatDateTime(item.publishTime),
					publisher: item.publisher || "",
					status: item.status || "enabled",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		async listParkingSpaceStructures(params: ListParkingSpaceStructureDiagramsParams) {
			const conditions = [];
			if (params.parkingLotId) {
				conditions.push(eq(pkCarports.parkingLotId, params.parkingLotId));
			}
			if (params.carportNo) {
				conditions.push(like(pkCarports.carportNumber, `%${params.carportNo}%`));
			}
			if (params.carportType) {
				conditions.push(eq(pkCarports.carportType, params.carportType));
			}
			if (params.status) {
				conditions.push(eq(pkCarports.status, params.status));
			}
			if (params.area) {
				conditions.push(like(pkCarports.area, `%${params.area}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(pkCarports)
				.where(where);
			const rows = await db
				.select()
				.from(pkCarports)
				.where(where)
				.orderBy(desc(pkCarports.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					parkingLotId: item.parkingLotId || "",
					carportNumber: item.carportNumber || "",
					carportType: item.carportType || "",
					area: item.area || "",
					status: item.status || "",
					ownerName: item.ownerName || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		async listPropertyRegisters(params: ListPropertyRegistersParams) {
			const conditions = [];
			if (params.applicant) {
				conditions.push(like(cmPropertyRegisters.ownerName, `%${params.applicant}%`));
			}
			if (params.status) {
				conditions.push(eq(cmPropertyRegisters.status, params.status as any));
			}
			if (params.propertyName) {
				conditions.push(like(cmPropertyRegisters.communityName, `%${params.propertyName}%`));
			}
			if (params.registerDate) {
				conditions.push(like(cmPropertyRegisters.registerDate, `%${params.registerDate}%`));
			}
			if (params.remark) {
				conditions.push(like(cmPropertyRegisters.remark, `%${params.remark}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(cmPropertyRegisters)
				.where(where);
			const rows = await db
				.select()
				.from(cmPropertyRegisters)
				.where(where)
				.orderBy(desc(cmPropertyRegisters.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					communityName: item.communityName || "",
					buildingNo: item.buildingNo || "",
					unitNo: item.unitNo || "",
					roomNo: item.roomNo || "",
					ownerName: item.ownerName || "",
					contactPhone: item.contactPhone || "",
					area: item.area || "",
					propertyType: item.propertyType || "",
					registerDate: item.registerDate || "",
					status: item.status || "enabled",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
	} satisfies Partial<CommunityRepository>);
}

class InMemoryCommunityRepository implements CommunityRepository {
	async listBuildingSpaceStructures() {
		return { list: [], total: 0 };
	}

	async listHandingBusinesses() {
		return { list: [], total: 0 };
	}

	async listHouseDecorations() {
		return { list: [], total: 0 };
	}

	async listMyCommunities() {
		return { list: [], total: 0 };
	}

	async listNotices() {
		return { list: [], total: 0 };
	}

	async listParkingSpaceStructures() {
		return { list: [], total: 0 };
	}

	async listPropertyRegisters() {
		return { list: [], total: 0 };
	}
}
