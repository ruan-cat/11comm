import { type IsAuditType, auditTypeOptions } from "@01s-11comm/type";

/**
 * 合同类型表单数据类型
 */
export interface ContractTypeFormVO {
	/** 类型名称 */
	typeName: string;
	/** 是否审核 */
	isAudit: IsAuditType;
	/** 描述 */
	description: string;
}

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ContractTypeFormVO = {
	typeName: "",
	isAudit: "yes",
	description: "",
};

// ==================== Props 类型定义 ====================

/**
 * 合同类型表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface AddFormProps {
	/** 表单数据 */
	form: ContractTypeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ContractTypeFormVO;
}

export { IsAuditType, auditTypeOptions };
