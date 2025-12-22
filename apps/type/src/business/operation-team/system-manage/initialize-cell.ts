import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 初始化小区
 */
export interface InitializeCell {
	/** 小区ID */
	id: string;
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
export interface InitializeCellListQuery extends BaseListQueryParams {
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
 * 初始化状态选项
 */
export const initializeCellStatusOptions: OptionsType = [
	{ label: "待初始化", value: "待初始化" },
	{ label: "初始化中", value: "初始化中" },
	{ label: "已完成", value: "已完成" },
	{ label: "初始化失败", value: "初始化失败" },
];
