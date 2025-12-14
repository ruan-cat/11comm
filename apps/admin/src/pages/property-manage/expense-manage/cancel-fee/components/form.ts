import { 审核状态Options } from "@01s-11comm/type";

// ==================== 类型定义 ====================

/** 取消费用表单数据类型 */
export interface CancelFeeFormVO {
	/** 批次号 */
	batchNumber: string;
	/** 员工 */
	employee: string;
	/** 时间 */
	time: string;
	/** 取消原因 */
	cancelReason: string;
	/** 审核状态 */
	auditStatus: string;
	/** 审核意见 */
	auditOpinion: string;
}

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: CancelFeeFormVO = {
	batchNumber: "",
	employee: "",
	time: "",
	cancelReason: "",
	auditStatus: "",
	auditOpinion: "",
};

/**
 * 取消费用表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CancelFeeFormProps {
	/** 表单数据 */
	form: CancelFeeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: CancelFeeFormVO;
}

export { 审核状态Options };
