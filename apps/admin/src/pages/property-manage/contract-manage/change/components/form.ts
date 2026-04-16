import type { ContractChangeFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ContractChangeFormVO = {
	contractName: "",
	contractNumber: "",
	contractType: "",
	partyA: "",
	partyAContact: "",
	partyAPhone: "",
	partyB: "",
	partyBContact: "",
	partyBPhone: "",
	handler: "",
	handlerPhone: "",
	contractAmount: "",
	startTime: "",
	endTime: "",
	signingTime: "",
	changeType: "合同金额",
	changer: "",
	description: "",
	beforeChange: "",
	afterChange: "",
	attachments: [],
};

/**
 * 合同变更表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ContractChangeFormProps {
	/** 表单数据 */
	form: ContractChangeFormVO & { id?: string };
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ContractChangeFormVO & { id?: string };
	/** 表单模式 */
	mode?: Mode;
}
