import type { Mode } from "@/composables/use-mode";

const REPORT_TYPES = ["reportGroup", "optionTitle", "sort", "description"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type ReportType = (typeof REPORT_TYPES)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
// TODO: 不要编写向后兼容的中文类型，直接用纯英文命名的类型做替换
export interface 报表信息表单_VO {
	reportGroup: string;
	optionTitle: string;
	sort: string;
	description: string;
}

/** 向后兼容：报表信息表单_VO */
// TODO: 不要编写向后兼容的中文类型，直接用纯英文命名的类型做替换
export type ReportInfoFormVO = 报表信息表单_VO;

/** 默认表单 @description 对外导出用于其他场景使用 */
// TODO: 不要编写向后兼容的中文类型，直接用纯英文命名的类型做替换
export const defaultForm: 报表信息表单_VO = {
	reportGroup: "",
	optionTitle: "",
	sort: "",
	description: "",
};

/**
 * 报表信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReportInfoFormProps {
	/** 表单数据 */
	form: 报表信息表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 报表信息表单_VO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
