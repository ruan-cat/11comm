import type { Mode } from "@/composables/use-mode";
import type { SettingCommunityConfigFormVO } from "@01s-11comm/type";

/** 小区配置弹窗表单字段，额外补充页面展示和提交都会使用的 operator。 */
export interface CommunityConfigurationFormData extends SettingCommunityConfigFormVO {
	operator: string;
}

/** 小区配置默认值，字段边界需与小区配置新增/编辑接口的表单 payload 保持一致。 */
export const defaultForm: CommunityConfigurationFormData = {
	csId: "",
	communityId: "",
	communityName: "",
	settingName: "",
	settingValue: "",
	settingType: "",
	statusCd: "0",
	remark: "",
	operator: "",
};

/**
 * 小区配置表单 props
 * @description
 * form/defaultValues 共同服务弹窗提交、重置和关闭前脏数据判断；info 模式只读展示。
 */
export interface CommunityConfigurationFormProps {
	/** 弹窗表单数据，新增来自 defaultForm，详情/编辑来自列表行转换结果。 */
	form: CommunityConfigurationFormData;
	/** 表单组件重置和关闭前比较使用的基准值。 */
	defaultValues: CommunityConfigurationFormData;
	/** 表单模式，info 模式下字段统一只读且页面隐藏提交区。 */
	mode?: Mode;
}
