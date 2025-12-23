import type { Mode } from "@/composables/use-mode";

const REPORT_GROUP_TYPES = ["组名称", "组url", "描述"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type ReportGroupType = (typeof REPORT_GROUP_TYPES)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface ReportGroupFormVO {
	groupName: string;
	groupUrl: string;
	description: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReportGroupFormVO = {
	groupName: "",
	groupUrl: "",
	description: "",
};

/**
 * 报表组表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReportGroupFormProps {
	/** 表单数据 */
	form: ReportGroupFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReportGroupFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
