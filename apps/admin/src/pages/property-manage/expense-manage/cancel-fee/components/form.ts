// ==================== 类型定义 ====================

/**
 * 取消费用表单数据类型
 */
export interface 取消费用表单_VO {
	/** 批次号 */
	批次号: string;
	/** 员工 */
	员工: string;
	/** 时间 */
	时间: string;
	/** 取消原因 */
	取消原因: string;
	/** 审核状态 */
	审核状态: string;
	/** 审核意见 */
	审核意见: string;
}

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 取消费用表单_VO = {
	批次号: "",
	员工: "",
	时间: "",
	取消原因: "",
	审核状态: "",
	审核意见: "",
};

/**
 * 取消费用表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CancelFeeFormProps {
	/** 表单数据 */
	form: 取消费用表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 取消费用表单_VO;
}