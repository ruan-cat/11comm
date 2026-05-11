/** 合同管理模块 - 类型定义 */

// --- Archive / ctArchives ---

export interface AdminArchiveListItem {
	id: string;
	contractName: string;
	contractNumber: string;
	contractType: string;
	partyA: string;
	partyB: string;
	archiveNo: string;
	archiveDate: string;
	archiveLocation: string;
	archiver: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListArchiveParams {
	pageIndex: number;
	pageSize: number;
	contractName?: string;
	contractNumber?: string;
	archiveNo?: string;
	archiver?: string;
}

// --- Attachment / ctAttachments ---

export interface AdminAttachmentListItem {
	id: string;
	attachmentName: string;
	contractId: string;
	contractNumber: string;
	contractName: string;
	attachmentType: string;
	mimeType: string;
	fileSize: number | null;
	filePath: string;
	uploadStatus: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListAttachmentParams {
	pageIndex: number;
	pageSize: number;
	attachmentName?: string;
	contractNumber?: string;
	contractName?: string;
	attachmentType?: string;
}

// --- Change / ctChanges ---

export interface AdminChangeListItem {
	id: string;
	contractName: string;
	contractNumber: string;
	contractType: string;
	partyA: string;
	partyB: string;
	changeType: string;
	changer: string;
	changeTime: string;
	description: string;
	approvalStatus: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListChangeParams {
	pageIndex: number;
	pageSize: number;
	contractName?: string;
	contractNumber?: string;
	contractType?: string;
	approvalStatus?: string;
}

// --- Clause / ctClauses ---

export interface AdminClauseListItem {
	id: string;
	templateId: string;
	clauseName: string;
	clauseType: string;
	clauseContent: string;
	sortOrder: number;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListClauseParams {
	pageIndex: number;
	pageSize: number;
	clauseName?: string;
	clauseType?: string;
	templateId?: string;
}

// --- DraftContract / ctContracts (status='draft') ---

export interface AdminDraftContractListItem {
	id: string;
	contractName: string;
	contractNumber: string;
	contractType: string;
	amount: string;
	partyA: string;
	partyB: string;
	startTime: string;
	endTime: string;
	signDate: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListDraftContractParams {
	pageIndex: number;
	pageSize: number;
	contractName?: string;
	contractNumber?: string;
	contractType?: string;
}

// --- Expire / ctContracts (expired/near-expiry) ---

export interface AdminExpireListItem {
	id: string;
	contractName: string;
	contractNumber: string;
	contractType: string;
	amount: string;
	startTime: string;
	endTime: string;
	signDate: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListExpireParams {
	pageIndex: number;
	pageSize: number;
	contractName?: string;
	contractNumber?: string;
	contractType?: string;
}

// --- FirstParty / ctFirstParties ---

export interface AdminFirstPartyListItem {
	id: string;
	name: string;
	contactPerson: string;
	contactPhone: string;
	address: string;
	creditCode: string;
	establishedDate: string;
	legalRepresentative: string;
	businessScope: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListFirstPartyParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	contactPerson?: string;
	creditCode?: string;
	status?: string;
}

// --- Print / ctPrints ---

export interface AdminPrintListItem {
	id: string;
	contractName: string;
	contractNumber: string;
	contractType: string;
	partyA: string;
	partyB: string;
	printCount: number;
	printTime: string;
	printer: string;
	createTime: string;
	updateTime: string;
}

export interface ListPrintParams {
	pageIndex: number;
	pageSize: number;
	contractName?: string;
	contractNumber?: string;
	contractType?: string;
}

// --- Review / ctReviews ---

export interface AdminReviewListItem {
	id: string;
	contractName: string;
	contractNumber: string;
	contractType: string;
	partyA: string;
	partyB: string;
	contractAmount: string;
	reviewer: string;
	reviewTime: string;
	reviewResult: string;
	reviewOpinion: string;
	createTime: string;
	updateTime: string;
}

export interface ListReviewParams {
	pageIndex: number;
	pageSize: number;
	contractName?: string;
	contractNumber?: string;
	contractType?: string;
	reviewResult?: string;
}

// --- SecondParty / ctSecondParties ---

export interface AdminSecondPartyListItem {
	id: string;
	name: string;
	partyType: string;
	contactPerson: string;
	contactPhone: string;
	address: string;
	ownerId: string | null;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListSecondPartyParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	partyType?: string;
	contactPerson?: string;
}

// --- Template / ctTemplates ---

export interface AdminTemplateListItem {
	id: string;
	templateName: string;
	templateType: string;
	version: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListTemplateParams {
	pageIndex: number;
	pageSize: number;
	templateName?: string;
	templateType?: string;
	status?: string;
}

// --- Type / ctTypes ---

export interface AdminContractTypeListItem {
	id: string;
	typeName: string;
	typeCode: string;
	typeDescription: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListContractTypeParams {
	pageIndex: number;
	pageSize: number;
	typeName?: string;
	typeCode?: string;
}
