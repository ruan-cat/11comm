import { RepairsTodoFormVO, defaultRepairsTodoForm } from "@01s-11comm/type";

// 为了向后兼容，创建类型别名
export type 报修待办表单_VO = RepairsTodoFormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultRepairsTodoForm;

/**
 * 报修待办表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface RepairsTodoFormProps {
	/** 表单数据 */
	form: RepairsTodoFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: RepairsTodoFormVO;
}
