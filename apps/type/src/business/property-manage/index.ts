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
	BuildingSpaceStructureDiagramFormVO,
	BuildingSpaceStructureDiagramFormProps,
	CommunityNoticeListItem,
	CommunityNoticeQueryParams,
	CommunityNoticeFormVO,
	CommunityNoticeFormProps,
	PropertyRegisterListItem,
	PropertyRegisterFormVO,
	PropertyRegisterQueryParams,
	HandingBusinessListItem,
	HandingBusinessQueryParams,
	HouseDecorationListItem,
	HouseDecorationQueryParams,
	Mode,
} from "./community-manage";

export {
	myStatusOptions,
	省份选项,
	// parkingSpaceTypeOptions 已移至 business-options.ts
	// parkingSpaceStatusOptions 已移至 business-options.ts
	floorAreaOptions,
	isChargingPileOptions,
	propertyRegisterStatusOptions,
	buildingOptions,
	unitOptions,
	defaultForm,
	defaultBuildingSpaceStructureDiagramForm,
	defaultCommunityNoticeForm,
	feeTypeOptions,
	feeStatusOptions,
	businessHandlingStatusOptions,
	decorationStatusOptions,
	delayStatusOptions,
	buildingStructureOptions,
	buildingStatusOptions,
	noticeTypeOptions,
	noticeStatusOptions,
	列表数据转表单数据,
} from "./community-manage";

// 房产管理模块
export * from "./house-property-manage";

// 合同管理模块 - 使用导入再导出避免重复
export type {
	ChangeListItem,
	ChangeQueryParams,
	DraftContractListItem,
	DraftContractQueryParamsType,
	ExpireListItem,
	ExpireQueryParams,
	FirstPartyListItem,
	FirstPartyQueryParams,
	TypeListItem,
	TypeQueryParams,
	ArchiveListItem,
	ArchiveQueryParams,
	AttachmentListItem,
	AttachmentQueryParams,
	ClauseListItem,
	ClauseQueryParams,
	PrintListItem,
	PrintQueryParams,
	ReviewListItem,
	ReviewQueryParams,
	SecondPartyListItem,
	SecondPartyQueryParams,
	TemplateListItem,
	TemplateQueryParams,
} from "./contract-manage";

export {
	changeStatusOptions,
	draftContractStatusOptions,
	contractTypeOptionsData,
	expireStatusOptions,
	handlingStatusOptions,
	firstPartyStatusOptions,
	typeStatusOptions,
	auditTypeOptions,
	archiveStatusOptions,
	archiveContractTypeOptions,
	attachmentTypeOptions,
	attachmentStatusOptions,
	clauseTypeOptions,
	clauseStatusOptions,
	printStatusOptions,
	printContractTypeOptions,
	reviewStatusOptions,
	reviewContractTypeOptions,
	secondPartyStatusOptions,
	templateStatusOptions,
	templateContractTypeOptions,
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
