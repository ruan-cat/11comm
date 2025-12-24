import type { BaseListQueryParams, OptionsType } from "../../../common";

/**
 * 小区信息列表项
 */
export interface CommunityInfoListItem {
	/** 小区ID */
	communityId: string;
	/** 小区名称 */
	communityName: string;
	/** 小区编码 */
	communityCode: string;
	/** 所属区域 */
	region: string;
	/** 城市编码 */
	cityCode: string;
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
	/** 省份 */
	province: string;
	/** 城市 */
	city: string;
	/** 区县 */
	district: string;
	/** 详细地址 */
	detailedAddress: string;
	/** 附近地标 */
	nearbyLandmark: string;
	/** 管理员 */
	administrator: string;
}

/**
 * 小区信息列表查询参数
 */
export interface CommunityInfoQueryParams extends BaseListQueryParams {
	/** 小区ID */
	communityId?: string;
	/** 小区名称 */
	communityName?: string;
	/** 省份 */
	province?: string;
	/** 城市 */
	city?: string;
	/** 区县 */
	district?: string;
	/** 物业公司 */
	propertyCompany?: string;
	/** 状态 */
	status?: string;
}

/**
 * 省份选项
 */
export const communityProvinceOptions: OptionsType = [
	{ label: "北京市", value: "北京市" },
	{ label: "上海市", value: "上海市" },
	{ label: "广州市", value: "广州市" },
	{ label: "深圳市", value: "深圳市" },
	{ label: "杭州市", value: "杭州市" },
];

/**
 * 城市选项
 */
export const communityCityOptions: OptionsType = [
	{ label: "北京市", value: "北京市" },
	{ label: "上海市", value: "上海市" },
	{ label: "广州市", value: "广州市" },
	{ label: "深圳市", value: "深圳市" },
	{ label: "杭州市", value: "杭州市" },
	{ label: "南京市", value: "南京市" },
	{ label: "武汉市", value: "武汉市" },
	{ label: "成都市", value: "成都市" },
];

/**
 * 区县选项
 */
export const communityDistrictOptions: OptionsType = [
	{ label: "朝阳区", value: "朝阳区" },
	{ label: "海淀区", value: "海淀区" },
	{ label: "东城区", value: "东城区" },
	{ label: "西城区", value: "西城区" },
	{ label: "丰台区", value: "丰台区" },
];

/**
 * 小区搜索选项
 */
export interface CommunitySearchOptions {
	provinces: OptionsType;
	cities: OptionsType;
	districts: OptionsType;
}

/**
 * 小区搜索选项
 */
export const communitySearchOptions: CommunitySearchOptions = {
	provinces: communityProvinceOptions,
	cities: communityCityOptions,
	districts: communityDistrictOptions,
};

/**
 * 小区信息
 * @deprecated 请使用 CommunityInfoListItem
 */
export interface CommunityInformation extends CommunityInfoListItem {}

/**
 * 小区信息列表查询参数
 * @deprecated 请使用 CommunityInfoQueryParams
 */
export interface CommunityInformationListQuery extends CommunityInfoQueryParams {}

/**
 * 状态选项
 */
export const communityInformationStatusOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "停用", value: "停用" },
	{ label: "筹建中", value: "筹建中" },
	{ label: "已交付", value: "已交付" },
];

/**
 * 小区信息表单 VO
 */
export interface CommunityInformationFormVO {
	/** 小区ID */
	communityId?: string;
	/** 小区名称 */
	communityName: string;
	/** 小区编码 */
	communityCode: string;
	/** 所属区域 */
	region: string;
	/** 城市编码 */
	cityCode: string;
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
	/** 省份 */
	province: string;
	/** 城市 */
	city: string;
	/** 区县 */
	district: string;
	/** 详细地址 */
	detailedAddress: string;
	/** 附近地标 */
	nearbyLandmark: string;
	/** 管理员 */
	administrator: string;
}
