import type { CancelFeeFormVO } from "@01s-11comm/type";

export type { CancelFeeFormVO };

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
	/** 表单模式 */
	mode?: Mode;
}
