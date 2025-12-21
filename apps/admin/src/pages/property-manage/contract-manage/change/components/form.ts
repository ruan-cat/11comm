import type { Mode } from "@/composables/use-mode";

/** 变更类型选项 */
const _changeType = ["合同金额", "服务期限", "服务内容", "付款方式", "合同主体"] as const;

/** 变更类型 */
export type ChangeType = (typeof _changeType)[number];

/** 合同变更表单业务类型 */
export interface ContractChangeFormVO {
	contractName: string;
	contractNumber: string;
	contractType: string;
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
	changeType: ChangeType;
	changer: string;
	description: string;
	beforeChange: string;
	afterChange: string;
	attachments?: any[];
}

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
	form: ContractChangeFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ContractChangeFormVO;
}
