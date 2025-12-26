import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 初始化小区列表项
 */
export interface InitializeCellListItem {
	/** 小区ID */
	id: string;
	/** 单元格ID */
	cellId: string;
	/** 单元格类型 */
	cellType: string;
	/** 小区名称 */
	cellName: string;
	/** 小区编码 */
	cellCode: string;
	/** 所属区域 */
	region: string;
	/** 详细地址 */
	address: string;
	/** 建筑面积 */
	buildingArea: number;
	/** 占地面积 */
	landArea: number;
	/** 楼栋ID */
	buildingId: string;
	/** 楼栋名称 */
	buildingName: string;
	/** 楼层 */
	floor: number;
	/** 单元号 */
	unitNumber: string;
	/** 楼栋数量 */
	buildingCount: number;
	/** 单元数量 */
	unitCount: number;
	/** 户数 */
	houseCount: number;
	/** 车位数量 */
	parkingCount: number;
	/** 绿化率 */
	greenRate: number;
	/** 容积率 */
	plotRatio: number;
	/** 开发商 */
	developer: string;
	/** 物业公司 */
	propertyCompany: string;
	/** 成立时间 */
	establishedTime: string;
	/** 初始化状态 */
	status: string;
	/** 描述 */
	description: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
}

/**
 * 初始化小区列表查询参数
 */
export interface InitializeCellQueryParams extends BaseListQueryParams {
	/** 小区名称 */
	cellName?: string;
	/** 小区编码 */
	cellCode?: string;
	/** 所属区域 */
	region?: string;
	/** 物业公司 */
	propertyCompany?: string;
	/** 初始化状态 */
	status?: string;
	/** 成立时间范围 */
	establishedTimeRange?: [string, string];
}

/**
 * 单元格类型选项
 */
export const cellTypeOptions: OptionsType = [
	{ label: "住宅单元", value: "住宅单元" },
	{ label: "商业单元", value: "商业单元" },
	{ label: "车库单元", value: "车库单元" },
	{ label: "办公单元", value: "办公单元" },
	{ label: "会所单元", value: "会所单元" },
	{ label: "物业单元", value: "物业单元" },
	{ label: "运动单元", value: "运动单元" },
	{ label: "教育单元", value: "教育单元" },
	{ label: "医疗单元", value: "医疗单元" },
	{ label: "仓储单元", value: "仓储单元" },
	{ label: "文化单元", value: "文化单元" },
];

/**
 * 初始化状态选项
 */
export const initializeCellStatusOptions: OptionsType = [
	{ label: "待初始化", value: "待初始化" },
	{ label: "初始化中", value: "初始化中" },
	{ label: "已完成", value: "已完成" },
	{ label: "初始化失败", value: "初始化失败" },
];

/**
 * 初始化小区
 * @deprecated 请使用 InitializeCellListItem
 */
export interface InitializeCell extends InitializeCellListItem {}

/**
 * 初始化小区列表查询参数
 * @deprecated 请使用 InitializeCellQueryParams
 */
export interface InitializeCellListQuery extends InitializeCellQueryParams {}

/** 单元格类型联合类型 */
export type CellType =
	| "ResidentialUnit"
	| "CommercialUnit"
	| "GarageUnit"
	| "OfficeUnit"
	| "ClubUnit"
	| "PropertyUnit"
	| "SportsUnit"
	| "EducationUnit"
	| "MedicalUnit"
	| "StorageUnit"
	| "CultureUnit";

/** 状态联合类型 */
export type CellStatus = "Initialized" | "Uninitialized" | "Initializing" | "InitializationFailed";

/**
 * 初始化单元格表单数据类型
 * @description
 * 用于表单组件的数据传输和验证
 */
export interface InitializeCellFormVO {
	/** 单元格名称 */
	cellName: string;
	/** 单元格类型 */
	cellType: CellType;
	/** 建筑物ID */
	buildingId: string;
	/** 建筑物名称 */
	buildingName: string;
	/** 楼层 */
	floor: string;
	/** 单元号 */
	unitNumber: string;
	/** 户数 */
	households: number;
	/** 状态 */
	status: CellStatus;
	/** 描述 */
	description: string;
}
