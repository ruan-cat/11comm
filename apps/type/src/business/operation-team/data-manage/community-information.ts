import type { OptionsType } from "../../../common";

/**
 * @description 小区信息列表数据
 * Community information list item
 */
export interface CommunityInfoListItem {
	/** 小区ID Community ID */
	communityId: string;
	/** 小区名称 Community name */
	communityName: string;
	/** 物业公司 Property company */
	propertyCompany: string;
	/** 附近地标 Nearby landmark */
	nearbyLandmark: string;
	/** 城市编码 City code */
	cityCode: string;
	/** 创建时间 Creation time */
	createTime: string;
	/** 社区编码 Community code */
	communityCode: string;
	/** 状态 Status */
	status: string;
	/** 省份 Province */
	province: string;
	/** 城市 City */
	city: string;
	/** 区县 District */
	district: string;
	/** 详细地址 Detailed address */
	detailedAddress: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 管理员 Administrator */
	administrator: string;
}

/**
 * @description 小区信息列表查询参数
 * Community information list query parameters
 */
export interface CommunityInfoQueryParams {
	/** 小区ID Community ID */
	communityId?: string;
	/** 小区名称 Community name */
	communityName?: string;
	/** 省份 Province */
	province?: string;
	/** 城市 City */
	city?: string;
	/** 区县 District */
	district?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 搜索栏下拉选项
 * Search options
 */
export const communitySearchOptions = {
	/** 省份选项 Province options */
	provinces: [
		{ label: "福建省", value: "福建省" },
		{ label: "浙江省", value: "浙江省" },
		{ label: "江苏省", value: "江苏省" },
		{ label: "广东省", value: "广东省" },
	] as OptionsType,

	/** 城市选项 City options */
	cities: [
		{ label: "福州市", value: "福州市" },
		{ label: "厦门市", value: "厦门市" },
		{ label: "漳州市", value: "漳州市" },
		{ label: "泉州市", value: "泉州市" },
	] as OptionsType,

	/** 区县选项 District options */
	districts: [
		{ label: "仓山区", value: "仓山区" },
		{ label: "鼓楼区", value: "鼓楼区" },
		{ label: "台江区", value: "台江区" },
		{ label: "晋安区", value: "晋安区" },
		{ label: "马尾区", value: "马尾区" },
		{ label: "长乐区", value: "长乐区" },
		{ label: "闽侯县", value: "闽侯县" },
	] as OptionsType,
};

/**
 * @description 小区信息表单业务类型 Community information form business type
 */
export interface CommunityInformationFormVO {
	/** 小区ID Community ID */
	communityId: string;
	/** 小区名称 Community name */
	communityName: string;
	/** 物业公司 Property company */
	propertyCompany: string;
	/** 附近地标 Nearby landmark */
	nearbyLandmark: string;
	/** 城市编码 City code */
	cityCode: string;
	/** 创建时间 Creation time */
	createTime: string;
	/** 社区编码 Community code */
	communityCode: string;
	/** 状态 Status */
	status: string;
	/** 省份 Province */
	province: string;
	/** 城市 City */
	city: string;
	/** 区县 District */
	district: string;
	/** 详细地址 Detailed address */
	detailedAddress: string;
	/** 联系电话 Contact phone */
	contactPhone: string;
	/** 管理员 Administrator */
	administrator: string;
}

/**
 * @description 默认表单 @description 对外导出用于其他场景使用 Default form for external use
 */
export const communityInformationDefaultForm: CommunityInformationFormVO = {
	communityId: "",
	communityName: "",
	propertyCompany: "",
	nearbyLandmark: "",
	cityCode: "",
	createTime: "",
	communityCode: "",
	status: "正常运营",
	province: "",
	city: "",
	district: "",
	detailedAddress: "",
	contactPhone: "",
	administrator: "",
};

/**
 * @description 小区信息表单 props Community information form props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 * To avoid global type conflicts, a longer type name is designed
 */
export interface CommunityInformationFormProps {
	/** 表单数据 Form data */
	form: CommunityInformationFormVO;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: CommunityInformationFormVO;
	/** 表单模式 Form mode */
	mode?: "add" | "edit" | "info";
}

