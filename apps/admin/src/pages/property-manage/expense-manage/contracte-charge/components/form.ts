// ==================== 类型定义 ====================

const _feeType = ["物业费", "押金", "煤气费", "取暖费", "维修费", "服务费", "其他", "系统费用", "租金"] as const;

/** 警告 这里仅为了演示 实际上的业务类型为 string */
export type FeeType = (typeof _feeType)[number];

/** 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内 */
export interface ContracteChargeFormVO {
	/** 费用类型 */
	feeType: FeeType;
	/** 收费项目 */
	chargeItem: string;
	/** 合同状态 */
	contractStatus: "待审核" | "审核中" | "审核完成";
	/** 计费起始时间 */
	billingStartTime: string;
	/** 计费结束时间 */
	billingEndTime: string;
}

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
