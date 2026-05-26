import type { Mode } from "@/composables/use-mode";

/** 注册协议弹窗表单字段，使用接口写入字段 protocolTitle/protocolContent。 */
export interface RegisterProtocolFormData {
	protocolType: string;
	protocolTitle: string;
	protocolContent: string;
	version: string;
	status: "enabled" | "disabled" | string;
}

/** 注册协议默认值，字段边界需与 sm_register_protocols 的新增/编辑 payload 保持一致。 */
export const defaultForm: RegisterProtocolFormData = {
	protocolType: "",
	protocolTitle: "",
	protocolContent: "",
	version: "",
	status: "enabled",
};

export interface RegisterProtocolFormProps {
	/** 弹窗表单数据，新增来自 defaultForm，详情/编辑来自列表行转换结果。 */
	form: RegisterProtocolFormData;
	/** 表单组件重置和关闭前比较使用的基准值。 */
	defaultValues: RegisterProtocolFormData;
	/** 表单模式，info 模式下字段统一只读且页面隐藏提交区。 */
	mode?: Mode;
}
