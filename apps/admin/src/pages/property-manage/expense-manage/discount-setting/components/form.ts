import type { DiscountSettingFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

// ==================== 类型定义 ====================

/**
 * 折扣设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface DiscountSettingFormProps {
	/** 表单数据 */
	form: DiscountSettingFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: DiscountSettingFormVO;
	/** 表单模式 */
	mode?: Mode;
}

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: DiscountSettingFormVO = {
	discountName: "",
	discountType: "优惠",
	rule: "",
	description: "",
};
