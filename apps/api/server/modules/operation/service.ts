import type { OperationRepository } from "./repository";
import type {
	ListCommunityInfoParams,
	ListPropertyManagementCompanyParams,
	ListPropertyCompanyParams,
	ListMerchantInfoParams,
	ListMerchantAdminParams,
	ListReportInfoParams,
	ListReportGroupParams,
	ListReportComponentParams,
	ListChangePasswordParams,
	ListCommunityConfigurationParams,
	ListInitializeCellParams,
	ListRegisterProtocolParams,
	ListSystemConfigParams,
} from "./types";

export interface OperationService {
	listCommunityInfo: OperationRepository["listCommunityInfo"];
	listPropertyManagementCompany: OperationRepository["listPropertyManagementCompany"];
	listPropertyCompany: OperationRepository["listPropertyCompany"];
	listMerchantInfo: OperationRepository["listMerchantInfo"];
	listMerchantAdmin: OperationRepository["listMerchantAdmin"];
	listReportInfo: OperationRepository["listReportInfo"];
	listReportGroup: OperationRepository["listReportGroup"];
	listReportComponent: OperationRepository["listReportComponent"];
	listChangePassword: OperationRepository["listChangePassword"];
	listCommunityConfiguration: OperationRepository["listCommunityConfiguration"];
	listInitializeCell: OperationRepository["listInitializeCell"];
	listRegisterProtocol: OperationRepository["listRegisterProtocol"];
	listSystemConfig: OperationRepository["listSystemConfig"];
}

export function createOperationService(repository: OperationRepository): OperationService {
	return {
		listCommunityInfo: (params: ListCommunityInfoParams) => repository.listCommunityInfo(params),
		listPropertyManagementCompany: (params: ListPropertyManagementCompanyParams) =>
			repository.listPropertyManagementCompany(params),
		listPropertyCompany: (params: ListPropertyCompanyParams) => repository.listPropertyCompany(params),
		listMerchantInfo: (params: ListMerchantInfoParams) => repository.listMerchantInfo(params),
		listMerchantAdmin: (params: ListMerchantAdminParams) => repository.listMerchantAdmin(params),
		listReportInfo: (params: ListReportInfoParams) => repository.listReportInfo(params),
		listReportGroup: (params: ListReportGroupParams) => repository.listReportGroup(params),
		listReportComponent: (params: ListReportComponentParams) => repository.listReportComponent(params),
		listChangePassword: (params: ListChangePasswordParams) => repository.listChangePassword(params),
		listCommunityConfiguration: (params: ListCommunityConfigurationParams) =>
			repository.listCommunityConfiguration(params),
		listInitializeCell: (params: ListInitializeCellParams) => repository.listInitializeCell(params),
		listRegisterProtocol: (params: ListRegisterProtocolParams) => repository.listRegisterProtocol(params),
		listSystemConfig: (params: ListSystemConfigParams) => repository.listSystemConfig(params),
	};
}
