import type { Mode } from "@/composables/use-mode";
import type { OwnerAccountFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: OwnerAccountFormVO = {
	accountType: "通用账户",
	ownerPhone: "",
	ownerName: "",
	prepaidAmount: "",
	paymentMethod: "现金",
	remark: "",
};

/**
 * 业主账户表单 props
 * Owner account form props
 */
export interface OwnerAccountFormProps {
	/** 表单数据 Form data */
	form: OwnerAccountFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: OwnerAccountFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
