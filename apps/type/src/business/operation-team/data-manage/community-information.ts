import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 小区信息
 */
export interface CommunityInformation {
	/** 小区ID */
	id: string;
	/** 小区名称 */
	communityName: string;
	/** 小区编码 */
	communityCode: string;
	/** 所属区域 */
	region: string;
	/** 详细地址 */
	address: string;
	/** 占地面积 */
	landArea: number;
	/** 建筑面积 */
	buildingArea: number;
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
	/** 联系电话 */
	contactPhone: string;
	/** 状态 */
	status: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 操作人 */
	operator: string;
}

/**
 * 小区信息列表查询参数
 */
export interface CommunityInformationListQuery extends BaseListQueryParams {
	/** 小区名称 */
	communityName?: string;
	/** 小区编码 */
	communityCode?: string;
	/** 所属区域 */
	region?: string;
	/** 物业公司 */
	propertyCompany?: string;
	/** 状态 */
	status?: string;
	/** 成立时间范围 */
	establishedTimeRange?: [string, string];
}

/**
 * 状态选项
 */
export const communityInformationStatusOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "停用", value: "停用" },
	{ label: "筹建中", value: "筹建中" },
	{ label: "已交付", value: "已交付" },
];
