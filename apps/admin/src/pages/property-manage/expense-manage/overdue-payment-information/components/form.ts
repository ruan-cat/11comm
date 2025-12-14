// ==================== 类型定义 ====================

/** 欠费信息表单数据类型 */
export interface OverduePaymentInformationFormVO {
	/** 收费对象 */
	chargeObject: string;
	/** 业主名称 */
	ownerName: string;
	/** 手机号 */
	phoneNumber: string;
	/** 开始时间 */
	startTime: string;
	/** 结束时间 */
	endTime: string;
	/** 欠费时间范围 */
	overdueTimeRange: [string, string];
	/** 欠费金额 */
	overdueAmount: string;
	/** 欠费说明 */
	overdueDescription: string;
	/** 缴费状态 */
	paymentStatus: string;
	/** 联系地址 */
	contactAddress: string;
}

// ==================== 常量定义 ====================

/** 收费对象选项 */
export const chargeObjectOptions = [
	{ label: "住宅", value: "住宅" },
	{ label: "商铺", value: "商铺" },
	{ label: "车库", value: "车库" },
	{ label: "储物间", value: "储物间" },
];

/** 缴费状态选项 */
export const paymentStatusOptions = [
	{ label: "未缴费", value: "未缴费" },
	{ label: "部分缴费", value: "部分缴费" },
	{ label: "已缴费", value: "已缴费" },
];

// ==================== 默认表单对象 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: OverduePaymentInformationFormVO = {
	chargeObject: "",
	ownerName: "",
	phoneNumber: "",
	startTime: "",
	endTime: "",
	overdueTimeRange: ["", ""],
	overdueAmount: "",
	overdueDescription: "",
	paymentStatus: "未缴费",
	contactAddress: "",
};

// ==================== 表单 Props 类型 ====================

/**
 * 欠费信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OverduePaymentInformationFormProps {
	/** 表单数据 */
	form: OverduePaymentInformationFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: OverduePaymentInformationFormVO;
}
