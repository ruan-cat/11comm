import type { Mode } from "@/composables/use-mode";
import type { SettingCommunityConfigFormVO } from "@01s-11comm/type";

/** 小区配置表单数据类型 */
export { SettingCommunityConfigFormVO };

// TODO: 不要编写向后兼容的中文类型，直接用纯英文命名的类型做替换
/** 小区配置表单 VO (别名) */
export type { SettingCommunityConfigFormVO as CommunityConfigFormVO };

// ==================== Options 导出 ====================

import { settingTypeOptions, communityConfigStatusOptions } from "@01s-11comm/type";

/** settingTypeOptions */
export { settingTypeOptions };

/** communityConfigStatusOptions */
export { communityConfigStatusOptions };

// ==================== 默认表单 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: SettingCommunityConfigFormVO = {
	csId: "",
	communityId: "",
	communityName: "",
	settingName: "",
	settingValue: "",
	settingType: "",
	statusCd: "0",
	remark: "",
};

// ==================== Props 类型 ====================

/**
 * 小区配置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CommunityConfigurationFormProps {
	/** 表单数据 */
	form: SettingCommunityConfigFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: SettingCommunityConfigFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
