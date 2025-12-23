import type { OptionsType } from "plus-pro-components";
import type { InitializeCommunityFormVO } from "@01s-11comm/type";
import { auditStatusOptions } from "@01s-11comm/type";

/** 状态选项 - 从类型项目导入的审核状态选项 */
export const statusOptions = auditStatusOptions;


/**
 * 默认表单
 * @description 对外导出用于其他场景使用
 */
export const defaultForm: InitializeCommunityFormVO = {
	communityId: "",
	communityName: "",
	nearbyLandmark: "",
	cityCode: "",
	status: "",
};

/**
 * 初始化小区表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface InitializeCommunityFormProps {
	/** 表单数据 */
	form: InitializeCommunityFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: InitializeCommunityFormVO;
}
