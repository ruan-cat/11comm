/**
 * @file 合同管理模块类型导出
 * @description 统一导出合同管理相关的所有业务类型
 */

// 导入并重新导出以避免重复
export type {
	ChangeListItem,
	ChangeQueryParams,
} from "./change";

export {
	changeStatusOptions,
} from "./change";

export type {
	DraftContractListItem,
	DraftContractQueryParams as DraftContractQueryParamsType,
} from "./draft-contract";

export {
	draftContractStatusOptions,
	draftContractTypeOptions,
} from "./draft-contract";

export type {
	ExpireListItem,
	ExpireQueryParams,
} from "./expire";

export {
	expireStatusOptions,
	expiredContractHandlingStatusOptions as handlingStatusOptions,
} from "./expire";

export type {
	FirstPartyListItem,
	FirstPartyQueryParams,
} from "./first-party";

export {
	firstPartyStatusOptions,
	contractFirstPartyTypeOptions,
} from "./first-party";

export type {
	TypeListItem,
	TypeQueryParams,
	IsAuditType,
} from "./type";

export {
	typeStatusOptions,
	auditTypeOptions,
} from "./type";

// ==================== 新增类型导出 ====================

export type {
	SecondPartyListItem,
	SecondPartyQueryParams,
} from "./second-party";

export {
	secondPartyStatusOptions,
} from "./second-party";

export type {
	ClauseListItem,
	ClauseQueryParams,
} from "./clause";

export {
	clauseTypeOptions,
	clauseStatusOptions,
} from "./clause";

export type {
	ArchiveListItem,
	ArchiveQueryParams,
} from "./archive";

export {
	archiveStatusOptions,
	archiveContractTypeOptions,
} from "./archive";

export type {
	ReviewListItem,
	ReviewQueryParams,
} from "./review";

export {
	reviewStatusOptions,
	reviewContractTypeOptions,
} from "./review";

export type {
	PrintListItem,
	PrintQueryParams,
} from "./print";

export {
	printStatusOptions,
	printContractTypeOptions,
} from "./print";

export type {
	TemplateListItem,
	TemplateQueryParams,
} from "./template";

export {
	templateStatusOptions,
	templateContractTypeOptions,
} from "./template";

export type {
	AttachmentListItem,
	AttachmentQueryParams,
} from "./attachment";

export {
	attachmentTypeOptions,
	attachmentStatusOptions,
} from "./attachment";
