// ==================== 类型定义 ====================

/** 欠费信息表单数据类型 */
export interface 欠费信息表单_VO {
	/** 收费对象 */
	收费对象: string;
	/** 业主名称 */
	业主名称: string;
	/** 手机号 */
	手机号: string;
	/** 开始时间 */
	开始时间: string;
	/** 结束时间 */
	结束时间: string;
	/** 欠费时间范围 */
	欠费时间范围: [string, string];
	/** 欠费金额 */
	欠费金额: string;
	/** 欠费说明 */
	欠费说明: string;
	/** 缴费状态 */
	缴费状态: string;
	/** 联系地址 */
	联系地址: string;
}

// ==================== 常量定义 ====================

/** 收费对象选项 */
export const 收费对象Options = [
	{ label: "住宅", value: "住宅" },
	{ label: "商铺", value: "商铺" },
	{ label: "车库", value: "车库" },
	{ label: "储物间", value: "储物间" },
];

/** 缴费状态选项 */
export const 缴费状态Options = [
	{ label: "未缴费", value: "未缴费" },
	{ label: "部分缴费", value: "部分缴费" },
	{ label: "已缴费", value: "已缴费" },
];

// ==================== 默认表单对象 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 欠费信息表单_VO = {
	收费对象: "",
	业主名称: "",
	手机号: "",
	开始时间: "",
	结束时间: "",
	欠费时间范围: ["", ""],
	欠费金额: "",
	欠费说明: "",
	缴费状态: "未缴费",
	联系地址: "",
};

// ==================== 表单 Props 类型 ====================

/**
 * 欠费信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OverduePaymentInformationFormProps {
	/** 表单数据 */
	form: 欠费信息表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 欠费信息表单_VO;
}
