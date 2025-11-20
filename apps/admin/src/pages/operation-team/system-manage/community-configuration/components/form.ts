import { type 小区配置表单_VO } from "../test-data";

// ==================== 默认表单 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 小区配置表单_VO = {
	csId: "",
	communityId: "",
	小区名称: "",
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
	form: 小区配置表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 小区配置表单_VO;
}