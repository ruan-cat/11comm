import { 折扣类型Options } from "@01s-11comm/type";

// ==================== 联合类型定义 ====================

/** 折扣类型联合类型 */
export type DiscountType = "百分比折扣" | "固定金额折扣" | "阶梯折扣";

// ==================== 类型定义 ====================

/** 优惠类型表单数据类型 */
export interface DiscountTypeFormVO {
	/** 折扣名称 */
	discountName: string;
	/** 折扣类型 */
	discountType: DiscountType;
	/** 规则名称 */
	ruleName: string;
	/** 规则 */
	rule: string;
}

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

export { 折扣类型Options };
