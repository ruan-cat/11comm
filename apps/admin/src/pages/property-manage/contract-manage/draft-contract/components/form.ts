import type { ContractDraftFormVO } from "@01s-11comm/type";

export type { ContractDraftFormVO };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ContractDraftFormVO = {
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
	description: "",
	attachments: [],
};

/**
 * 合同草稿表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ContractDraftFormProps {
	/** 表单数据 */
	form: ContractDraftFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ContractDraftFormVO;
	/** 表单模式 */
	mode?: Mode;
}
