import type { Mode } from "@/composables/use-mode";

/** 系统配置弹窗表单字段，字段集合直接作为 create/update 的业务 payload。 */
export interface SystemConfigFormData {
	configKey: string;
	configValue: string;
	configType: string;
	configDescription: string;
	status: "enabled" | "disabled";
}

/** 系统配置弹窗默认值，字段需与 sm_system_configs 的新增/编辑 payload 保持一致。 */
export const defaultForm: SystemConfigFormData = {
	configKey: "",
	configValue: "",
	configType: "text",
	configDescription: "",
	status: "enabled",
};

export interface SystemConfigFormProps {
	/** 弹窗表单数据，新增来自 defaultForm，详情/编辑来自列表行转换结果。 */
	form: SystemConfigFormData;
	/** 表单组件重置和关闭前比较使用的基准值。 */
	defaultValues: SystemConfigFormData;
	/** 弹窗模式，info 模式由表单列统一切换为只读。 */
	mode?: Mode;
}
