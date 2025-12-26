import { discountTypeOptions } from "@01s-11comm/type";
import type { DiscountType, DiscountTypeFormVO } from "@01s-11comm/type";

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: DiscountTypeFormVO = {
	discountName: "",
	discountType: "百分比折扣",
	ruleName: "",
	rule: "",
};

/**
 * 优惠类型表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface DiscountTypeFormProps {
	/** 表单数据 */
	form: DiscountTypeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: DiscountTypeFormVO;
	/** 是否禁用表单 - 用于查看模式 */
	disabled?: boolean;
}
