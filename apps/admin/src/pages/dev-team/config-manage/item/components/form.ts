/**
 * @file 配置项表单类型定义
 * @description 表单字段必须对齐字典配置项接口允许写入的字段。
 */

import { type Mode } from "@/composables/use-mode";

export interface DictionaryItemFormData {
	/** 所属字典 id，当前表单沿用列表/API 字段 dictionaryId，不在前端改名为 dictionaryCode。 */
	dictionaryId: string;
	/** 配置项名称，对应字典项接口的 itemName。 */
	itemName: string;
	/** 配置项编码，对应字典项接口的 itemCode。 */
	itemCode: string;
	/** 排序值，提交前保持 number，避免接口收到输入框字符串。 */
	sortOrder: number;
	/** 是否默认项，提交给接口的是 boolean，不是中文 label。 */
	isDefault: boolean;
}

/** 配置项默认表单，字段集合必须和 DictionaryItemFormData 保持一致。 */
export const defaultForm: DictionaryItemFormData = {
	dictionaryId: "",
	itemName: "",
	itemCode: "",
	sortOrder: 0,
	isDefault: false,
};

export interface ConfigItemFormProps {
	/** 弹窗当前表单数据，新增/编辑提交时会原样组装为字典项接口 payload。 */
	form: DictionaryItemFormData;
	/** 表单组件重置和关闭前比较使用的基准值，需要和打开弹窗时的初始 form 保持一致。 */
	defaultValues: DictionaryItemFormData;
	/** 弹窗模式，info 模式只读展示并隐藏提交区域。 */
	mode?: Mode;
}
