import type { HandingBusinessFormVO } from "@01s-11comm/type";
import { type Mode } from "@/composables/use-mode";

/**
 * 业务受理表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface HandingBusinessFormProps {
	/** 表单数据 */
	form: HandingBusinessFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: HandingBusinessFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: HandingBusinessFormVO = {
	feeItem: "",
	feeId: "",
	feeType: "",
	amountReceivable: "",
	accountCreationTime: "",
	receivablePeriod: "",
	description: "",
	status: "待缴费",
};
