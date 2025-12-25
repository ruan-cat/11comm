import type { RepairsSettingFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: RepairsSettingFormVO = {
	typeName: "",
	settingType: "repair",
	dispatchMethod: "assign",
	publicArea: "house",
	ownerDisplay: "yes",
	notificationMethod: "wechat",
	returnVisitSetting: "visit",
	description: "",
};

/**
 * 报修设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface RepairsSettingFormProps {
	/** 表单数据 */
	form: RepairsSettingFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: RepairsSettingFormVO;
	/** 表单模式 */
	mode?: Mode;
}
