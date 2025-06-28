/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 业委会表单_VO = {
	姓名: "",
	性别: "",
	电话: "",
	身份证号码: "",
	住址: "",
	职位: "",
	岗位: "",
	岗位描述: "",
	届期: "",
	任期: "",
	状态: "",
	备注: "",
};

/**
 * 业委会表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnersCommitteeProps {
	/** 表单数据 */
	form: 业委会表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 业委会表单_VO;
}
