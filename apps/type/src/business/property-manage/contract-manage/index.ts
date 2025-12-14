/**
 * @file 合同管理模块类型导出
 * @description 统一导出合同管理相关的所有业务类型
 */

// 导入并重新导出以避免重复
export type {
	ChangeListItem,
	ChangeQueryParams,
	业务受理_列表数据,
	合同类型_列表查询_VO,
} from "./change";

export {
	changeStatusOptions,
} from "./change";

export type {
	DraftContractListItem,
	DraftContractQueryParams as DraftContractQueryParamsType,
	合同草稿_列表数据,
} from "./draft-contract";

export {
	draftContractStatusOptions,
	合同草稿类型Options,
	contractTypeOptionsData,
	合同草稿状态Options,
} from "./draft-contract";

export type {
	ExpireListItem,
	ExpireQueryParams,
	到期合同_列表数据,
	到期合同_列表查询_VO,
} from "./expire";

export {
	expireStatusOptions,
	到期合同处理状态Options,
	到期合同类型Options,
	处理状态Options,
} from "./expire";

export type {
	FirstPartyListItem,
	FirstPartyQueryParams,
	合同甲方_列表数据,
} from "./first-party";

export {
	firstPartyStatusOptions,
	合同甲方类型Options,
} from "./first-party";

export type {
	TypeListItem,
	TypeQueryParams,
	合同类型_列表数据,
	合同类型_列表查询_VO as TypeQueryParamsVO,
} from "./type";

export {
	typeStatusOptions,
	审核类型Options,
} from "./type";
