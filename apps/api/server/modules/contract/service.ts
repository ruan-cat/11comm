import type { ContractRepository } from "./repository";
import { createContractUploadService } from "./upload-service";
import type {
	UploadAbortInput,
	UploadCompleteInput,
	UploadInitInput,
	UploadSignPartInput,
	UploadStatusInput,
} from "./upload-service";

type ContractUploadService = ReturnType<typeof createContractUploadService>;

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
	// change CRUD
	createChange: ContractRepository["createChange"];
	getChangeDetail: ContractRepository["getChangeDetail"];
	updateChange: ContractRepository["updateChange"];
	deleteChange: ContractRepository["deleteChange"];
	// draft-contract CRUD
	createDraftContract: ContractRepository["createDraftContract"];
	getDraftContractDetail: ContractRepository["getDraftContractDetail"];
	updateDraftContract: ContractRepository["updateDraftContract"];
	deleteDraftContract: ContractRepository["deleteDraftContract"];
	// upload/R2
	uploadInit: (input: UploadInitInput) => ReturnType<ContractUploadService["initUpload"]>;
	uploadStatus: (input: UploadStatusInput) => ReturnType<ContractUploadService["getStatus"]>;
	uploadSignPart: (input: UploadSignPartInput) => ReturnType<ContractUploadService["signPart"]>;
	uploadComplete: (input: UploadCompleteInput) => ReturnType<ContractUploadService["completeUpload"]>;
	uploadAbort: (input: UploadAbortInput) => ReturnType<ContractUploadService["abortUpload"]>;
}

export function createContractService(
	repository: ContractRepository,
	uploadService: ContractUploadService = createContractUploadService(),
): ContractService {
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
		createChange: (data) => repository.createChange(data),
		getChangeDetail: (id) => repository.getChangeDetail(id),
		updateChange: (data) => repository.updateChange(data),
		deleteChange: (id) => repository.deleteChange(id),
		createDraftContract: (data) => repository.createDraftContract(data),
		getDraftContractDetail: (id) => repository.getDraftContractDetail(id),
		updateDraftContract: (data) => repository.updateDraftContract(data),
		deleteDraftContract: (id) => repository.deleteDraftContract(id),
		uploadInit: (input) => uploadService.initUpload(input),
		uploadStatus: (input) => uploadService.getStatus(input),
		uploadSignPart: (input) => uploadService.signPart(input),
		uploadComplete: (input) => uploadService.completeUpload(input),
		uploadAbort: (input) => uploadService.abortUpload(input),
	};
}
