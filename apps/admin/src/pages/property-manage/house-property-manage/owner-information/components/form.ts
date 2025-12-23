import type { OwnerInformationFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: OwnerInformationFormVO = {
	personnelType: "个人",
	personnelRole: "业主",
	customerName: "",
	contactPhone: "",
	gender: "男",
	backupPhone: "",
	address: "",
	accessKey: "",
	idCard: "",
	remark: "",
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

