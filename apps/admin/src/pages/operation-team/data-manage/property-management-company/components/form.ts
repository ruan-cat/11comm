/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 物业公司表单_VO = {
	名称: "",
	地址: "",
	电话: "",
	公司法人: "",
	成立日期: "",
	地标: "",
	开通小区: "",
};

/**
 * 物业公司表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PropertyManagementCompanyFormProps {
	/** 表单数据 */
	form: 物业公司表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 物业公司表单_VO;
}
