import type { RegisterProtocolFormVO } from "@01s-11comm/type";

/** 默认表单 @description 用于初始化表单数据 */
export const defaultForm: RegisterProtocolFormVO = {
	protocolName: "",
	protocolType: "用户注册协议",
	protocolVersion: "v1.0.0",
	status: "Draft",
	isMandatory: "Yes",
	protocolSummary: "",
	protocolContent: "",
	effectiveDate: "",
	expirationDate: "",
	sortWeight: 0,
};

/**
 * 注册协议表单 props
 * @description
 * 这个表单需要的参数，具体每个参数的含义，请参考每个参数的注释
 */
export interface RegisterProtocolFormProps {
	/** 表单数据 */
	form: RegisterProtocolFormVO;
	/** 表单默认值重置对象（必填） */
	defaultValues: RegisterProtocolFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
