import type { OptionsType } from "plus-pro-components";
import type { MerchantAdminFormVO } from "@01s-11comm/type";
import { type Mode } from "@/composables/use-mode";

// TODO: 迁移到 type 项目内
/** 物业公司选项 */
export const propertyCompanyOptions: OptionsType = [
	{ label: "物业公司A", value: "物业公司A" },
	{ label: "物业公司B", value: "物业公司B" },
	{ label: "物业公司C", value: "物业公司C" },
];

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: MerchantAdminFormVO = {
	merchantId: "",
	username: "",
	realName: "",
	phone: "",
	email: "",
	gender: "male",
	position: "",
	idCard: "",
	emergencyContact: "",
	emergencyPhone: "",
	permissionLevel: "normal_admin",
	status: "normal",
};

/**
 * 商户管理员表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 * To avoid global type conflicts, a longer type name is designed
 */
export interface MerchantAdminFormProps {
	/** 表单数据 Form data */
	form: MerchantAdminFormVO;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: MerchantAdminFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
