import type { OptionsType } from "plus-pro-components";
import type { Mode } from "@/composables/use-mode";
import type { MerchantInfoFormVO, MerchantType, BusinessStatus } from "@01s-11comm/type";

// TODO: 迁移到 type 项目内
/** 商户类型选项 */
export const merchantTypeOptions: OptionsType = [
	{ label: "餐饮", value: "餐饮" },
	{ label: "零售", value: "零售" },
	{ label: "服务", value: "服务" },
	{ label: "娱乐", value: "娱乐" },
];

// TODO: 迁移到 type 项目内
/** 经营状态选项 */
export const businessStatusOptions: OptionsType = [
	{ label: "营业中", value: "营业中" },
	{ label: "暂停营业", value: "暂停营业" },
	{ label: "已关闭", value: "已关闭" },
];

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: MerchantInfoFormVO = {
	merchantName: "",
	merchantCode: "",
	merchantType: "",
	contactPerson: "",
	contactPhone: "",
	contactMobile: "",
	email: "",
	businessLicenseNumber: "",
	businessLicenseNo: "",
	legalRepresentative: "",
	registeredAddress: "",
	businessAddress: "",
	merchantAddress: "",
	registeredCapital: 0,
	establishedTime: "",
	establishmentDate: "",
	businessScope: "",
	serviceCommunities: "",
	affiliatedCommunity: "",
	contractStartTime: "",
	contractEndTime: "",
	businessHours: "",
	businessArea: "",
	status: "",
	businessStatus: "",
	bankName: "",
	bankAccount: "",
	remarks: "",
};

/**
 * 商户信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface MerchantInfoFormProps {
	/** 表单数据 */
	form: MerchantInfoFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: MerchantInfoFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

export type { MerchantInfoFormVO, MerchantType, BusinessStatus };
export { merchantTypeOptions, businessStatusOptions };
