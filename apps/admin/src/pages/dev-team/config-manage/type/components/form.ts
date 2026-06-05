/**
 * @file 字典类型表单类型定义
 * @description 表单字段必须对齐 dt_config_types 接口允许写入的字段。
 */

import type { Mode } from "@/composables/use-mode";

export interface DictionaryTypeFormData {
	/** 类型名称，对应字典类型接口的 typeName。 */
	typeName: string;
	/** 类型编码，对应字典类型接口的 typeCode。 */
	typeCode: string;
	/** 类型描述，对应字典类型接口的 typeDescription。 */
	typeDescription: string;
	/** 排序值，提交前保持 number，避免接口收到输入框字符串。 */
	sortOrder: number;
}

/** 字典类型默认表单，字段集合必须和 DictionaryTypeFormData 保持一致。 */
export const defaultForm: DictionaryTypeFormData = {
	typeName: "",
	typeCode: "",
	typeDescription: "",
	sortOrder: 0,
};

export interface DictionaryTypeFormProps {
	/** 弹窗当前表单数据，新增/编辑提交时会原样组装为字典类型接口 payload。 */
	form: DictionaryTypeFormData;
	/** 表单组件重置和关闭前比较使用的基准值，需要和打开弹窗时的初始 form 保持一致。 */
	defaultValues: DictionaryTypeFormData;
	/** 弹窗模式，info 模式只读展示并隐藏提交区域。 */
	mode?: Mode;
}
