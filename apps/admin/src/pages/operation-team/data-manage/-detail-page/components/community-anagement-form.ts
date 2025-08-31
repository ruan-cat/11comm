/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 管理小区表单_VO = {
	开通小区: "",
	功能: "",
};

/**
 * 管理小区表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CommunityManagementFormProps {
	/** 表单数据 */
	form: 管理小区表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 管理小区表单_VO;
}
