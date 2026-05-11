import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type {
	AdminHouseListItem,
	AdminInvoiceListItem,
	AdminInvoiceTitleListItem,
	AdminOwnerAccountListItem,
	AdminOwnerInformationListItem,
	AdminOwnerMemberListItem,
	AdminOwnersCommitteeListItem,
	AdminReserveVenueListItem,
	AdminReserveVenueOrderListItem,
	AdminSiteManagementListItem,
} from "./types";
import type { HouseService } from "./service";
import { adminSuccess } from "../../shared/runtime/response-builder";

export function createAdminHouseAdapter(service: HouseService) {
	return {
		async listHouses(input: {
			pageIndex?: number;
			pageSize?: number;
			communityId?: string;
			buildingNo?: string;
			unitNo?: string;
			roomNo?: string;
			ownerName?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<AdminHouseListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listHouses({
				pageIndex,
				pageSize,
				communityId: blankToUndefined(input.communityId),
				buildingNo: blankToUndefined(input.buildingNo),
				unitNo: blankToUndefined(input.unitNo),
				roomNo: blankToUndefined(input.roomNo),
				ownerName: blankToUndefined(input.ownerName),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listInvoices(input: {
			pageIndex?: number;
			pageSize?: number;
			invoiceNo?: string;
			invoiceType?: string;
			ownerName?: string;
			auditStatus?: string;
		}): Promise<JsonVO<PageDTO<AdminInvoiceListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listInvoices({
				pageIndex,
				pageSize,
				invoiceNo: blankToUndefined(input.invoiceNo),
				invoiceType: blankToUndefined(input.invoiceType),
				ownerName: blankToUndefined(input.ownerName),
				auditStatus: blankToUndefined(input.auditStatus),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listInvoiceTitles(input: {
			pageIndex?: number;
			pageSize?: number;
			ownerName?: string;
		}): Promise<JsonVO<PageDTO<AdminInvoiceTitleListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listInvoiceTitles({
				pageIndex,
				pageSize,
				ownerName: blankToUndefined(input.ownerName),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listOwnerAccounts(input: {
			pageIndex?: number;
			pageSize?: number;
			accountName?: string;
			accountType?: string;
		}): Promise<JsonVO<PageDTO<AdminOwnerAccountListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnerAccounts({
				pageIndex,
				pageSize,
				accountName: blankToUndefined(input.accountName),
				accountType: blankToUndefined(input.accountType),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listOwnerInformation(input: {
			pageIndex?: number;
			pageSize?: number;
			name?: string;
			phone?: string;
			idCard?: string;
		}): Promise<JsonVO<PageDTO<AdminOwnerInformationListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnerInformation({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
				phone: blankToUndefined(input.phone),
				idCard: blankToUndefined(input.idCard),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listOwnerMembers(input: {
			pageIndex?: number;
			pageSize?: number;
			name?: string;
			memberType?: string;
		}): Promise<JsonVO<PageDTO<AdminOwnerMemberListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnerMembers({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
				memberType: blankToUndefined(input.memberType),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listOwnersCommittees(input: {
			pageIndex?: number;
			pageSize?: number;
			committeeName?: string;
			term?: string;
			chairman?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<AdminOwnersCommitteeListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnersCommittees({
				pageIndex,
				pageSize,
				committeeName: blankToUndefined(input.committeeName),
				term: blankToUndefined(input.term),
				chairman: blankToUndefined(input.chairman),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listReserveVenues(input: {
			pageIndex?: number;
			pageSize?: number;
			venueName?: string;
			venueType?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<AdminReserveVenueListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listReserveVenues({
				pageIndex,
				pageSize,
				venueName: blankToUndefined(input.venueName),
				venueType: blankToUndefined(input.venueType),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listReserveVenueOrders(input: {
			pageIndex?: number;
			pageSize?: number;
			venueId?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<AdminReserveVenueOrderListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listReserveVenueOrders({
				pageIndex,
				pageSize,
				venueId: blankToUndefined(input.venueId),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listSiteManagements(input: {
			pageIndex?: number;
			pageSize?: number;
			siteName?: string;
			location?: string;
			manager?: string;
		}): Promise<JsonVO<PageDTO<AdminSiteManagementListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listSiteManagements({
				pageIndex,
				pageSize,
				siteName: blankToUndefined(input.siteName),
				location: blankToUndefined(input.location),
				manager: blankToUndefined(input.manager),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function blankToUndefined(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
