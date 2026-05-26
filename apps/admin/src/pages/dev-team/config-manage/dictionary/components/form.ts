/**
 * @file 字典表单类型定义
 * @description 表单字段必须对齐字典新增/更新接口允许写入的字段。
 */

import { type Mode } from "@/composables/use-mode";

export interface DictionaryFormData {
	/** 字典名称，对应字典接口的 dictionaryName。 */
	dictionaryName: string;
	/** 字典编码，对应字典接口的 dictionaryCode。 */
	dictionaryCode: string;
	/** 字典类型，使用接口选项值，不使用翻译后的中文 label。 */
	dictionaryType: string;
	/** 字典描述，对应接口的 dictionaryDescription。 */
	dictionaryDescription: string;
	/** 备注字段，仅在接口支持写入时参与提交。 */
	remark: string;
}

/** 字典默认表单，不包含 schema/API 写入链路不存在的启停字段。 */
export const defaultForm: DictionaryFormData = {
	dictionaryName: "",
	dictionaryCode: "",
	dictionaryType: "",
	dictionaryDescription: "",
	remark: "",
};

/**
 * 字典表单 props
 * @description form/defaultValues 共同服务弹窗提交和关闭前脏数据判断。
 */
export interface DictionaryFormProps {
	/** 弹窗当前表单数据，新增/编辑提交时会原样组装为字典接口 payload。 */
	form: DictionaryFormData;
	/** 表单组件重置和关闭前比较使用的基准值，需要和打开弹窗时的初始 form 保持一致。 */
	defaultValues: DictionaryFormData;
	/** 弹窗模式，info 模式只读展示并隐藏提交区域。 */
	mode?: Mode;
}
