import type { HouseRepository } from "./repository";
import type {
	ListHousesParams,
	ListInvoicesParams,
	ListInvoiceTitlesParams,
	ListOwnerAccountsParams,
	ListOwnerInformationParams,
	ListOwnerMembersParams,
	ListOwnersCommitteesParams,
	ListReserveVenuesParams,
	ListReserveVenueOrdersParams,
	ListSiteManagementsParams,
} from "./types";

export interface HouseService {
	listHouses: (params: ListHousesParams) => ReturnType<HouseRepository["listHouses"]>;
	listInvoices: (params: ListInvoicesParams) => ReturnType<HouseRepository["listInvoices"]>;
	listInvoiceTitles: (params: ListInvoiceTitlesParams) => ReturnType<HouseRepository["listInvoiceTitles"]>;
	listOwnerAccounts: (params: ListOwnerAccountsParams) => ReturnType<HouseRepository["listOwnerAccounts"]>;
	listOwnerInformation: (params: ListOwnerInformationParams) => ReturnType<HouseRepository["listOwnerInformation"]>;
	listOwnerMembers: (params: ListOwnerMembersParams) => ReturnType<HouseRepository["listOwnerMembers"]>;
	listOwnersCommittees: (params: ListOwnersCommitteesParams) => ReturnType<HouseRepository["listOwnersCommittees"]>;
	listReserveVenues: (params: ListReserveVenuesParams) => ReturnType<HouseRepository["listReserveVenues"]>;
	listReserveVenueOrders: (
		params: ListReserveVenueOrdersParams,
	) => ReturnType<HouseRepository["listReserveVenueOrders"]>;
	listSiteManagements: (params: ListSiteManagementsParams) => ReturnType<HouseRepository["listSiteManagements"]>;
}

export function createHouseService(repository: HouseRepository): HouseService {
	return {
		listHouses: (params) => repository.listHouses(params),
		listInvoices: (params) => repository.listInvoices(params),
		listInvoiceTitles: (params) => repository.listInvoiceTitles(params),
		listOwnerAccounts: (params) => repository.listOwnerAccounts(params),
		listOwnerInformation: (params) => repository.listOwnerInformation(params),
		listOwnerMembers: (params) => repository.listOwnerMembers(params),
		listOwnersCommittees: (params) => repository.listOwnersCommittees(params),
		listReserveVenues: (params) => repository.listReserveVenues(params),
		listReserveVenueOrders: (params) => repository.listReserveVenueOrders(params),
		listSiteManagements: (params) => repository.listSiteManagements(params),
	};
}
