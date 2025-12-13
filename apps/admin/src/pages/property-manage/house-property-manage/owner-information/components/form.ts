import type { OwnerInformationFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: OwnerInformationFormVO = {
	人员类型: "个人",
	人员角色: "业主",
	客户名称: "",
	联系手机: "",
	性别: "男",
	备用手机: "",
	地址: "",
	门禁钥匙: "",
	身份证: "",
	备注: "",
};

/**
 * 业主信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnerInformationFormProps {
	/** 表单数据 */
	form: OwnerInformationFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: OwnerInformationFormVO;
}
