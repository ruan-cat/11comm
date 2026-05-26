import type { Mode } from "@/composables/use-mode";

/** 初始化小区弹窗表单字段，configParams 在组件内保持 textarea 字符串形态。 */
export interface InitializeCellFormData {
	initItem: string;
	initStatus: string;
	configParams: string;
}

/** 初始化小区表单默认值，configParams 保持字符串形态供 textarea 编辑，提交前再解析为 JSON。 */
export const defaultForm: InitializeCellFormData = {
	initItem: "",
	initStatus: "",
	configParams: "{}",
};

export interface InitializeCommunityFormProps {
	/** 弹窗表单数据，新增来自 defaultForm，详情/编辑来自列表行转换结果。 */
	form: InitializeCellFormData;
	/** 表单组件重置和关闭前比较使用的基准值。 */
	defaultValues: InitializeCellFormData;
	/** 表单模式，info 模式下字段统一只读且页面隐藏提交区。 */
	mode?: Mode;
}
