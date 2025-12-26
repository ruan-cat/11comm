import type { ContractFeeType, ContracteChargeFormVO } from "@01s-11comm/type";

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ContracteChargeFormVO = {
	feeType: "物业费",
	chargeItem: "",
	contractStatus: "待审核",
	billingStartTime: "",
	billingEndTime: "",
};

/**
 * 合同收费表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ContracteChargeFormProps {
	/** 表单数据 */
	form: ContracteChargeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ContracteChargeFormVO;
}
