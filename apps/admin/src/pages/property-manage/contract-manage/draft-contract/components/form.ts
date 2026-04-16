import type { AttachmentDetailItem, ContractDraftFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

/** 默认表单值 */
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
 * 单独声明局部 props 类型，避免和全局表单类型混淆。
 */
export interface ContractDraftFormProps {
	/** 表单数据 */
	form: ContractDraftFormVO;
	/** 表单组件重置时使用的默认值 */
	defaultValues: ContractDraftFormVO;
	/** 已有附件详情 */
	detailAttachments?: AttachmentDetailItem[];
	/** 表单模式 */
	mode?: Mode;
}
