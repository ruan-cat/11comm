import { type OptionsType } from "plus-pro-components";
import type { Mode } from "@/composables/use-mode";

/** 小区状态选项 */
export const communityStatuses = ["正常运营", "筹备中", "维护中", "已停用"] as const;

export type CommunityStatus = (typeof communityStatuses)[number];

/** 小区状态选项列表 */
export const communityStatusOptions: OptionsType = communityStatuses.map((status) => ({
	label: status,
	value: status,
}));

/** 物业公司选项 */
export const propertyCompanies = [
	"万科物业",
	"碧桂园物业",
	"恒大物业",
	"保利物业",
	"龙湖物业",
	"华润物业",
	"中海物业",
	"金科物业",
] as const;

export type PropertyCompany = (typeof propertyCompanies)[number];

/** 物业公司选项列表 */
export const propertyCompanyOptions: OptionsType = propertyCompanies.map((company) => ({
	label: company,
	value: company,
}));

/** 小区信息表单数据接口 */
export interface CommunityManageFormVO {
	/** 省份 */
	province: string;
	/** 城市 */
	city: string;
	/** 区县 */
	district: string;
	/** 小区名称 */
	name: string;
	/** 小区编码 */
	code: string;
	/** 客服电话 */
	servicePhone: string;
	/** 面积 */
	area: string;
	/** 开始时间 */
	startTime: string;
	/** 结束时间 */
	endTime: string;
	/** 状态 */
	status: CommunityStatus;
}

/** 默认表单数据 @description 对外导出用于其他场景使用 */
export const defaultForm: CommunityManageFormVO = {
	province: "",
	city: "",
	district: "",
	name: "",
	code: "",
	servicePhone: "",
	area: "",
	startTime: "",
	endTime: "",
	status: "正常运营",
};

/**
 * 小区管理表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CommunityManageFormProps {
	/** 表单数据 */
	form: CommunityManageFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: CommunityManageFormVO;
	/** 表单模式 */
	mode?: Mode;
}

/** 导出选项数据供组件使用 */
export const communityOptions = {
	statuses: communityStatusOptions,
	propertyCompanies: propertyCompanyOptions,
};
