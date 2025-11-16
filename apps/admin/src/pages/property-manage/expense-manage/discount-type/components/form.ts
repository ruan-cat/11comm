// ==================== 类型定义 ====================

/** 优惠类型表单数据类型 */
export interface 优惠类型表单_VO {
	/** 折扣名称 */
	折扣名称: string;
	/** 折扣类型 */
	折扣类型: string;
	/** 规则名称 */
	规则名称: string;
	/** 规则 */
	规则: string;
}

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 优惠类型表单_VO = {
	折扣名称: "",
	折扣类型: "日常优惠",
	规则名称: "",
	规则: "",
};

/**
 * 优惠类型表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface DiscountTypeFormProps {
	/** 表单数据 */
	form: 优惠类型表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 优惠类型表单_VO;
}
