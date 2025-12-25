import type { ContractExpireFormVO, ProcessingType, ContractType } from "@01s-11comm/type";

export type { ContractExpireFormVO, ProcessingType, ContractType };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ContractExpireFormVO = {
	contractName: "",
	contractNumber: "",
	contractType: "采购合同",
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
	processingType: "续签",
	processor: "",
	description: "",
	attachments: [],
};

/**
 * 合同到期表单组件属性接口
 * Contract expire form props
 */
export interface ContractExpireFormProps {
	/** 表单数据 */
	form: ContractExpireFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ContractExpireFormVO;
	/** 表单模式 */
	mode?: Mode;
}
