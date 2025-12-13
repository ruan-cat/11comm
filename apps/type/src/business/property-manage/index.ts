/**
 * @file property-manage 模块类型导出
 * @description 物业管理模块的所有业务类型
 */

// TODO: 改写代码写法 改写成批量导出的写法

// 社区管理模块 - 过滤掉重复的审核状态Options
export type {
	MyCommunityListItem,
	MyCommunityQueryParams,
	MyListItem,
	MyQueryParams,
	ParkingSpaceStructureDiagramListItem,
	ParkingSpaceStructureDiagramQueryParams,
	BuildingSpaceStructureDiagramListItem,
	BuildingSpaceStructureDiagramQueryParams,
	CommunityNoticeListItem,
	CommunityNoticeQueryParams,
	PropertyRegisterListItem,
	PropertyRegisterFormVO,
	PropertyRegisterQueryParams,
	HandingBusinessListItem,
	HandingBusinessQueryParams,
	HouseDecorationListItem,
	HouseDecorationQueryParams,
	车位结构图_列表数据,
	车位结构图_列表查询_VO,
	产权登记_列表数据,
	产权登记_列表查询_VO,
	产权登记表单_VO,
} from "./community-manage";

export {
	myStatusOptions,
	省份选项,
	小区状态选项,
	车位类型选项,
	车位状态选项,
	楼层区域选项,
	是否充电桩选项,
	propertyRegisterStatusOptions,
	楼栋Options,
	单元Options,
	defaultForm,
	feeTypeOptions,
	feeStatusOptions,
	费用类型Options,
	业务受理状态Options,
	decorationStatusOptions,
	delayStatusOptions,
	产权登记审核状态Options,
	产权登记审核状态选项,
	// 导出审核状态选项的别名以避免冲突
	审核状态Options as CommunityAuditStatusOptions,
} from "./community-manage";

// 房产管理模块
export * from "./house-property-manage";

// 合同管理模块 - 使用导入再导出避免重复
export type {
	ChangeListItem,
	ChangeQueryParams,
	业务受理_列表数据,
	合同类型_列表查询_VO,
	DraftContractListItem,
	DraftContractQueryParamsType,
	合同草稿_列表数据,
	ExpireListItem,
	ExpireQueryParams,
	到期合同_列表数据,
	到期合同_列表查询_VO,
	FirstPartyListItem,
	FirstPartyQueryParams,
	合同甲方_列表数据,
	TypeListItem,
	TypeQueryParams,
	合同类型_列表数据,
	TypeQueryParamsVO,
} from "./contract-manage";

export {
	changeStatusOptions,
	合同类型Options as ContractTypeOptionsFromChange,
	draftContractStatusOptions,
	合同草稿类型Options,
	contractTypeOptionsData,
	合同草稿状态Options,
	expireStatusOptions,
	到期合同处理状态Options,
	到期合同类型Options,
	处理状态Options,
	firstPartyStatusOptions,
	合同甲方类型Options,
	typeStatusOptions,
	审核类型Options,
} from "./contract-manage";

// 费用管理模块
export * from "./expense-manage";

// 停车管理模块
export * from "./parking-manage";

// 巡检管理模块
export * from "./patrol-manage";

// 报修管理模块
export * from "./repairs-manage";

// 报表管理模块
export * from "./report-manage";
