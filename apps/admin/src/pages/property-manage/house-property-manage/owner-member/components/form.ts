
/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 业主成员表单_VO = {
	成员人脸: "",
	名称: "",
	性别: "",
	类型: "",
	身份证: "",
	联系方式: "",
	家庭住址: "",
	创建人: "",
	备注: "",
	门禁钥匙: "",
};

/**
 * 业主成员表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnerMemberFormProps {
	/** 表单数据 */
	form: 业主成员表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 业主成员表单_VO;
}

export type { 业主成员表单_VO };
