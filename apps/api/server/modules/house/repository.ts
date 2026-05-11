import { and, desc, eq, like, sql } from "drizzle-orm";
import {
	hpHouses,
	hpOwners,
	hpOwnerMembers,
	hpOwnerAccounts,
	hpOwnersCommittees,
	hpReserveVenues,
	hpReserveVenueOrders,
	hpSiteManagements,
	hpInvoices,
	hpInvoiceTitles,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	AdminHouseListItem,
	ListHousesParams,
	AdminInvoiceListItem,
	ListInvoicesParams,
	AdminInvoiceTitleListItem,
	ListInvoiceTitlesParams,
	AdminOwnerAccountListItem,
	ListOwnerAccountsParams,
	AdminOwnerInformationListItem,
	ListOwnerInformationParams,
	AdminOwnerMemberListItem,
	ListOwnerMembersParams,
	AdminOwnersCommitteeListItem,
	ListOwnersCommitteesParams,
	AdminReserveVenueListItem,
	ListReserveVenuesParams,
	AdminReserveVenueOrderListItem,
	ListReserveVenueOrdersParams,
	AdminSiteManagementListItem,
	ListSiteManagementsParams,
} from "./types";

export interface HouseRepository {
	listHouses: (params: ListHousesParams) => Promise<{ list: AdminHouseListItem[]; total: number }>;
	listInvoices: (params: ListInvoicesParams) => Promise<{ list: AdminInvoiceListItem[]; total: number }>;
	listInvoiceTitles: (params: ListInvoiceTitlesParams) => Promise<{ list: AdminInvoiceTitleListItem[]; total: number }>;
	listOwnerAccounts: (params: ListOwnerAccountsParams) => Promise<{ list: AdminOwnerAccountListItem[]; total: number }>;
	listOwnerInformation: (
		params: ListOwnerInformationParams,
	) => Promise<{ list: AdminOwnerInformationListItem[]; total: number }>;
	listOwnerMembers: (params: ListOwnerMembersParams) => Promise<{ list: AdminOwnerMemberListItem[]; total: number }>;
	listOwnersCommittees: (
		params: ListOwnersCommitteesParams,
	) => Promise<{ list: AdminOwnersCommitteeListItem[]; total: number }>;
	listReserveVenues: (params: ListReserveVenuesParams) => Promise<{ list: AdminReserveVenueListItem[]; total: number }>;
	listReserveVenueOrders: (
		params: ListReserveVenueOrdersParams,
	) => Promise<{ list: AdminReserveVenueOrderListItem[]; total: number }>;
	listSiteManagements: (
		params: ListSiteManagementsParams,
	) => Promise<{ list: AdminSiteManagementListItem[]; total: number }>;
}

export function createHouseRepository(options: { db?: DbType } = {}): HouseRepository {
	return options.db ? createDbHouseRepository(options.db) : createInMemoryHouseRepository();
}

export function createDbHouseRepository(db: DbType): HouseRepository {
	const fallback = createInMemoryHouseRepository();

	return Object.assign(fallback, {
		// ---- house/list ----
		async listHouses(params: ListHousesParams): Promise<{ list: AdminHouseListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
			if (params.communityId) {
				conditions.push(eq(hpHouses.communityId, params.communityId as any));
			}
			if (params.buildingNo) {
				conditions.push(eq(hpHouses.buildingNo, params.buildingNo));
			}
			if (params.unitNo) {
				conditions.push(eq(hpHouses.unitNo, params.unitNo));
			}
			if (params.roomNo) {
				conditions.push(like(hpHouses.roomNo, `%${params.roomNo}%`));
			}
			if (params.status) {
				conditions.push(eq(hpHouses.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpHouses)
				.where(where);
			const rows = await db
				.select()
				.from(hpHouses)
				.where(where)
				.orderBy(desc(hpHouses.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					communityId: item.communityId || "",
					buildingNo: item.buildingNo || "",
					unitNo: item.unitNo || "",
					floor: item.floor,
					roomNo: item.roomNo || "",
					houseNumber: item.houseNumber,
					buildingArea: item.buildingArea,
					usableArea: item.usableArea,
					houseType: item.houseType,
					status: item.status || "enabled",
					rent: item.rent,
					validUntil: item.validUntil || null,
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- invoice/list ----
		async listInvoices(params: ListInvoicesParams): Promise<{ list: AdminInvoiceListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
			if (params.invoiceNo) {
				conditions.push(like(hpInvoices.invoiceNo, `%${params.invoiceNo}%`));
			}
			if (params.invoiceType) {
				conditions.push(eq(hpInvoices.invoiceType, params.invoiceType));
			}
			if (params.ownerName) {
				conditions.push(like(hpInvoices.ownerName, `%${params.ownerName}%`));
			}
			if (params.auditStatus) {
				conditions.push(eq(hpInvoices.auditStatus, params.auditStatus));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpInvoices)
				.where(where);
			const rows = await db
				.select()
				.from(hpInvoices)
				.where(where)
				.orderBy(desc(hpInvoices.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					invoiceNo: item.invoiceNo,
					invoiceType: item.invoiceType,
					amount: item.amount,
					invoiceDate: item.invoiceDate || null,
					ownerName: item.ownerName,
					applicant: item.applicant,
					invoiceTitle: item.invoiceTitle,
					taxpayerId: item.taxpayerId,
					auditStatus: item.auditStatus || "pending",
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- invoice-title/list ----
		async listInvoiceTitles(
			params: ListInvoiceTitlesParams,
		): Promise<{ list: AdminInvoiceTitleListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];

			if (params.ownerName) {
				conditions.push(like(hpOwners.name, `%${params.ownerName}%`));
				const where = conditions.length > 0 ? and(...conditions) : undefined;
				const countResult = await db
					.select({ total: sql<number>`count(*)` })
					.from(hpInvoiceTitles)
					.innerJoin(hpOwners, eq(hpInvoiceTitles.ownerId, hpOwners.id))
					.where(where);
				const rows = await db
					.select({
						id: hpInvoiceTitles.id,
						ownerId: hpInvoiceTitles.ownerId,
						titleName: hpInvoiceTitles.titleName,
						taxpayerNo: hpInvoiceTitles.taxpayerNo,
						addressPhone: hpInvoiceTitles.addressPhone,
						bankAccount: hpInvoiceTitles.bankAccount,
						remark: hpInvoiceTitles.remark,
						createTime: hpInvoiceTitles.createTime,
						updateTime: hpInvoiceTitles.updateTime,
						ownerName: hpOwners.name,
					})
					.from(hpInvoiceTitles)
					.innerJoin(hpOwners, eq(hpInvoiceTitles.ownerId, hpOwners.id))
					.where(where)
					.orderBy(desc(hpInvoiceTitles.createTime))
					.limit(params.pageSize)
					.offset((params.pageIndex - 1) * params.pageSize);
				return {
					total: Number(countResult[0]?.total || 0),
					list: rows.map((item) => ({
						id: item.id,
						ownerName: item.ownerName,
						titleName: item.titleName,
						taxpayerNo: item.taxpayerNo,
						addressPhone: item.addressPhone,
						bankAccount: item.bankAccount,
						remark: item.remark,
						createTime: formatDateTime(item.createTime),
						updateTime: formatDateTime(item.updateTime),
					})),
				};
			}

			// single table, no join
			const countResult = await db.select({ total: sql<number>`count(*)` }).from(hpInvoiceTitles);
			const rows = await db
				.select()
				.from(hpInvoiceTitles)
				.orderBy(desc(hpInvoiceTitles.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);
			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					ownerName: "",
					titleName: item.titleName,
					taxpayerNo: item.taxpayerNo,
					addressPhone: item.addressPhone,
					bankAccount: item.bankAccount,
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- owner-account/list ----
		async listOwnerAccounts(
			params: ListOwnerAccountsParams,
		): Promise<{ list: AdminOwnerAccountListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
			if (params.accountName) {
				conditions.push(like(hpOwnerAccounts.accountName, `%${params.accountName}%`));
			}
			if (params.accountType) {
				conditions.push(eq(hpOwnerAccounts.accountType, params.accountType));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpOwnerAccounts)
				.where(where);
			const rows = await db
				.select()
				.from(hpOwnerAccounts)
				.where(where)
				.orderBy(desc(hpOwnerAccounts.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					ownerId: item.ownerId,
					accountNo: item.accountNo,
					accountName: item.accountName,
					accountType: item.accountType,
					balance: item.balance,
					deductionHouse: item.deductionHouse,
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- owner-information/list ----
		async listOwnerInformation(
			params: ListOwnerInformationParams,
		): Promise<{ list: AdminOwnerInformationListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
			if (params.name) {
				conditions.push(like(hpOwners.name, `%${params.name}%`));
			}
			if (params.phone) {
				conditions.push(like(hpOwners.phone, `%${params.phone}%`));
			}
			if (params.idCard) {
				conditions.push(like(hpOwners.idCard, `%${params.idCard}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpOwners)
				.where(where);
			const rows = await db
				.select()
				.from(hpOwners)
				.where(where)
				.orderBy(desc(hpOwners.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					name: item.name,
					idCard: item.idCard,
					phone: item.phone,
					gender: item.gender,
					email: item.email,
					address: item.address,
					emergencyContact: item.emergencyContact,
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- owner-member/list ----
		async listOwnerMembers(
			params: ListOwnerMembersParams,
		): Promise<{ list: AdminOwnerMemberListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
			if (params.name) {
				conditions.push(like(hpOwnerMembers.name, `%${params.name}%`));
			}
			if (params.memberType) {
				conditions.push(eq(hpOwnerMembers.memberType, params.memberType));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpOwnerMembers)
				.where(where);
			const rows = await db
				.select()
				.from(hpOwnerMembers)
				.where(where)
				.orderBy(desc(hpOwnerMembers.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					ownerId: item.ownerId,
					name: item.name,
					gender: item.gender,
					memberType: item.memberType,
					idCard: item.idCard,
					phone: item.phone,
					homeAddress: item.homeAddress,
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- owners-committee/list ----
		async listOwnersCommittees(
			params: ListOwnersCommitteesParams,
		): Promise<{ list: AdminOwnersCommitteeListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
			if (params.committeeName) {
				conditions.push(like(hpOwnersCommittees.committeeName, `%${params.committeeName}%`));
			}
			if (params.term) {
				conditions.push(eq(hpOwnersCommittees.term, params.term));
			}
			if (params.chairman) {
				conditions.push(like(hpOwnersCommittees.chairman, `%${params.chairman}%`));
			}
			if (params.status) {
				conditions.push(eq(hpOwnersCommittees.status, params.status));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpOwnersCommittees)
				.where(where);
			const rows = await db
				.select()
				.from(hpOwnersCommittees)
				.where(where)
				.orderBy(desc(hpOwnersCommittees.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					committeeName: item.committeeName,
					establishedDate: item.establishedDate || null,
					term: item.term,
					chairman: item.chairman,
					contactPhone: item.contactPhone,
					status: item.status,
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- reserve-venue/list ----
		async listReserveVenues(
			params: ListReserveVenuesParams,
		): Promise<{ list: AdminReserveVenueListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
			if (params.venueName) {
				conditions.push(like(hpReserveVenues.venueName, `%${params.venueName}%`));
			}
			if (params.venueType) {
				conditions.push(eq(hpReserveVenues.venueType, params.venueType));
			}
			if (params.status) {
				conditions.push(eq(hpReserveVenues.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpReserveVenues)
				.where(where);
			const rows = await db
				.select()
				.from(hpReserveVenues)
				.where(where)
				.orderBy(desc(hpReserveVenues.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					venueName: item.venueName,
					venueType: item.venueType,
					capacity: item.capacity,
					openTime: item.openTime,
					chargeStandard: item.chargeStandard,
					status: item.status || "enabled",
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- reserve-venue-order/list ----
		async listReserveVenueOrders(
			params: ListReserveVenueOrdersParams,
		): Promise<{ list: AdminReserveVenueOrderListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
			if (params.venueId) {
				conditions.push(eq(hpReserveVenueOrders.venueId, params.venueId as any));
			}
			if (params.status) {
				conditions.push(eq(hpReserveVenueOrders.status, params.status));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpReserveVenueOrders)
				.where(where);
			const rows = await db
				.select()
				.from(hpReserveVenueOrders)
				.where(where)
				.orderBy(desc(hpReserveVenueOrders.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					venueId: item.venueId,
					booker: item.booker,
					contactPhone: item.contactPhone,
					timeSlot: item.timeSlot,
					status: item.status,
					remark: item.remark,
					reservationTime: item.reservationTime ? formatDateTime(item.reservationTime) : null,
					startTime: item.startTime ? formatDateTime(item.startTime) : null,
					endTime: item.endTime ? formatDateTime(item.endTime) : null,
					numberOfUsers: item.numberOfUsers,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},

		// ---- site-management/list ----
		async listSiteManagements(
			params: ListSiteManagementsParams,
		): Promise<{ list: AdminSiteManagementListItem[]; total: number }> {
			const conditions: ReturnType<typeof eq>[] = [];
			if (params.siteName) {
				conditions.push(like(hpSiteManagements.siteName, `%${params.siteName}%`));
			}
			if (params.location) {
				conditions.push(like(hpSiteManagements.location, `%${params.location}%`));
			}
			if (params.manager) {
				conditions.push(like(hpSiteManagements.manager, `%${params.manager}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(hpSiteManagements)
				.where(where);
			const rows = await db
				.select()
				.from(hpSiteManagements)
				.where(where)
				.orderBy(desc(hpSiteManagements.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					siteName: item.siteName,
					location: item.location,
					manager: item.manager,
					maintenanceRecord: item.maintenanceRecord,
					remark: item.remark,
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
	} satisfies Partial<HouseRepository>);
}

// ==========================================
// InMemory 实现
// ==========================================

class InMemoryHouseRepository implements HouseRepository {
	async listHouses(params: ListHousesParams): Promise<{ list: AdminHouseListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listInvoices(params: ListInvoicesParams): Promise<{ list: AdminInvoiceListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listInvoiceTitles(
		params: ListInvoiceTitlesParams,
	): Promise<{ list: AdminInvoiceTitleListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listOwnerAccounts(
		params: ListOwnerAccountsParams,
	): Promise<{ list: AdminOwnerAccountListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listOwnerInformation(
		params: ListOwnerInformationParams,
	): Promise<{ list: AdminOwnerInformationListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listOwnerMembers(params: ListOwnerMembersParams): Promise<{ list: AdminOwnerMemberListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listOwnersCommittees(
		params: ListOwnersCommitteesParams,
	): Promise<{ list: AdminOwnersCommitteeListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listReserveVenues(
		params: ListReserveVenuesParams,
	): Promise<{ list: AdminReserveVenueListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listReserveVenueOrders(
		params: ListReserveVenueOrdersParams,
	): Promise<{ list: AdminReserveVenueOrderListItem[]; total: number }> {
		return { list: [], total: 0 };
	}

	async listSiteManagements(
		params: ListSiteManagementsParams,
	): Promise<{ list: AdminSiteManagementListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
}

export function createInMemoryHouseRepository(): HouseRepository {
	return new InMemoryHouseRepository();
}
