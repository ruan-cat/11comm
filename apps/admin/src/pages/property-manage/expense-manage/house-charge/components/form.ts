import { defaultHouseChargeForm } from "@01s-11comm/type";
import type { HouseChargeFormVO, 房屋收费_VO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

// Re-export types from type package for compatibility
export type {
	房屋收费_VO,
	费用标识类型,
	付费类型,
	账户抵扣类型,
	手机缴费类型,
	进位方式类型,
	保留小数位类型,
	状态类型,
	费用类型,
} from "@01s-11comm/type";

// ==================== 类型定义 ====================

/**
 * 费用项设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface HouseChargeFormProps {
	/** 表单数据 */
	form: 房屋收费_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 房屋收费_VO;
	/** 表单模式 */
	mode?: Mode;
}

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultHouseChargeForm;
