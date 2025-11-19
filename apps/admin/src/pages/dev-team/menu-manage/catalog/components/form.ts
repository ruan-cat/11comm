import { type 菜单目录表单_VO } from "../test-data";

// ==================== 默认表单 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 菜单目录表单_VO = {
	gid: "",
	icon: "",
	name: "",
	seq: 0,
	description: "",
	groupType: "",
	label: "",
	storeType: "",
};

// ==================== Props 类型 ====================

/**
 * 菜单目录表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CatalogFormProps {
	/** 表单数据 */
	form: 菜单目录表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 菜单目录表单_VO;
}