
/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 巡检项目表单_VO = {
	编号: "",
	巡检项目: "",
	创建时间: "",
	备注: "",
};

/**
 * 巡检项目表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PatrolItemFormProps {
	/** 表单数据 */
	form: 巡检项目表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 巡检项目表单_VO;
}

/** 重新导出表单类型 */
export type { 巡检项目表单_VO } from "@01s-11comm/type";
