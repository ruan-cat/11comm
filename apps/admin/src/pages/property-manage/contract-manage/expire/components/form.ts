// ==================== 联合类型定义 ====================

/** 到期处理类型常量 */
const _processingType = ["续签", "终止"] as const;

/** 合同类型常量 */
const _contractType = ["采购合同", "销售合同", "服务合同", "租赁合同", "劳务合同", "技术合同"] as const;

/** 到期处理类型联合类型 */
export type ProcessingType = (typeof _processingType)[number];

/** 合同类型联合类型 */
export type ContractType = (typeof _contractType)[number];

/** 合同到期表单接口 */
export interface ContractExpireFormVO {
	contractName: string;
	contractNumber: string;
	contractType: ContractType;
	partyA: string;
	partyAContact: string;
	partyAPhone: string;
	partyB: string;
	partyBContact: string;
	partyBPhone: string;
	handler: string;
	handlerPhone: string;
	contractAmount: string;
	startTime: string;
	endTime: string;
	signingTime: string;
	processingType: ProcessingType;
	processor: string;
	description: string;
	attachments?: any[];
}

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

/** 合同到期表单组件属性接口 */
export interface ContractExpireFormProps {
	/** 表单数据 */
	form: ContractExpireFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ContractExpireFormVO;
}
