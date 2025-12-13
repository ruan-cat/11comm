
/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 巡检路线_表单数据 = {
	巡检点ID: "",
	巡检点名称: "",
	巡检点类型: "",
	巡检位置: "",
	开始时间: "",
	结束时间: "",
	排序: "",
};

/**
 * 巡检路线表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PatrolPathFormProps {
	/** 表单数据 */
	form: 巡检路线_表单数据;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 巡检路线_表单数据;
}
