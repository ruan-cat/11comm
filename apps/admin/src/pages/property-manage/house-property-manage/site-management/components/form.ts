import type { SiteManagementFormVO, 场地管理_VO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";
import { siteManagementStatusOptions } from "@01s-11comm/type";

// TODO: 需要换成英文类型 不允许写成中文类型
// 兼容旧版中文选项
/** 场地状态选项（兼容性） */
export const 场地状态Options = siteManagementStatusOptions;

// TODO: 需要换成英文类型 不允许写成中文类型
// 兼容旧版类型导出
export type { 场地管理_VO };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: SiteManagementFormVO = {
	idNumber: "",
	name: "",
	openingTime: "",
	closingTime: "",
	hourlyFee: "",
	administrator: "",
	administratorPhone: "",
	status: "可预约",
};

/**
 * 场地管理表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface SiteManagementFormProps {
	/** 表单数据 */
	form: SiteManagementFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: SiteManagementFormVO;
	/** 表单模式 */
	mode?: Mode;
}
