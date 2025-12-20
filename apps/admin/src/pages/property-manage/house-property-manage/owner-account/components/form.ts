import type { OwnerAccountFormVO } from "@01s-11comm/type";
import { accountTypeOptions, paymentMethodOptions } from "@01s-11comm/type";

/**
 * @description 业主账户表单默认值
 * Owner account form default values
 */
export const defaultForm: OwnerAccountFormVO = {
	accountType: "通用账户",
	ownerPhone: "",
	ownerName: "",
	prepaidAmount: "",
	paymentMethod: "现金",
	remark: "",
};

// ==================== 表单Props类型定义 ====================

/**
 * 业主账户表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnerAccountFormProps {
	/** 表单数据 */
	form: OwnerAccountFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: OwnerAccountFormVO;
}

// ==================== 导出表单相关 ====================

export { accountTypeOptions, paymentMethodOptions };
