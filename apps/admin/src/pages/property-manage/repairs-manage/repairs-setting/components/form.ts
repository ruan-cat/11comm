import {
	RepairsSettingFormVO,
	defaultRepairsSettingForm,
	type RepairsSettingType,
	type DispatchMethodType,
	type AreaType,
	type OwnerDisplayType,
	type NotificationMethodType,
	type ReturnVisitSettingType
} from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

// 为了向后兼容，创建类型别名
export type 报修设置类型 = RepairsSettingType;
export type 派单方式类型 = DispatchMethodType;
export type 区域类型 = AreaType;
export type 业主端展示类型 = OwnerDisplayType;
export type 通知方式类型 = NotificationMethodType;
export type 回访设置类型 = ReturnVisitSettingType;
export type 报修设置表单_VO = RepairsSettingFormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultRepairsSettingForm;

/**
 * 报修设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface RepairsSettingFormProps {
	/** 表单数据 */
	form: RepairsSettingFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: RepairsSettingFormVO;
	/** 表单模式 */
	mode?: Mode;
}
