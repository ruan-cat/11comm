import type { ContractRepository } from "./repository";

export interface ContractService {
	listArchive: ContractRepository["listArchive"];
	listAttachment: ContractRepository["listAttachment"];
	listChange: ContractRepository["listChange"];
	listClause: ContractRepository["listClause"];
	listDraftContract: ContractRepository["listDraftContract"];
	listExpire: ContractRepository["listExpire"];
	listFirstParty: ContractRepository["listFirstParty"];
	listPrint: ContractRepository["listPrint"];
	listReview: ContractRepository["listReview"];
	listSecondParty: ContractRepository["listSecondParty"];
	listTemplate: ContractRepository["listTemplate"];
	listContractType: ContractRepository["listContractType"];
}

export function createContractService(repository: ContractRepository): ContractService {
	return {
		listArchive: (params) => repository.listArchive(params),
		listAttachment: (params) => repository.listAttachment(params),
		listChange: (params) => repository.listChange(params),
		listClause: (params) => repository.listClause(params),
		listDraftContract: (params) => repository.listDraftContract(params),
		listExpire: (params) => repository.listExpire(params),
		listFirstParty: (params) => repository.listFirstParty(params),
		listPrint: (params) => repository.listPrint(params),
		listReview: (params) => repository.listReview(params),
		listSecondParty: (params) => repository.listSecondParty(params),
		listTemplate: (params) => repository.listTemplate(params),
		listContractType: (params) => repository.listContractType(params),
	};
}
