<!--
  字典类型表单
  用于新增、修改字典类型
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { DictionaryTypeFormVO } from "@01s-11comm/type";
import {
	dictionaryTypeStatusOptions,
	dictionaryCategoryOptions,
	dataTypeOptions,
	requiredOptions,
} from "@01s-11comm/type";

import {
	DictionaryTypeFormProps,
	defaultForm,
} from "./form";

const props = defineProps<DictionaryTypeFormProps>();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & DictionaryTypeFormVO;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = cloneDeep(props.form) as FieldValues & DictionaryTypeFormVO;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 Form columns configuration */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "字典编号",
		prop: "dictionaryNumber",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入字典编号",
		},
	},
	{
		label: "字典名称",
		prop: "dictionaryName",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入字典名称",
		},
	},
	{
		label: "字典类型",
		prop: "dictionaryType",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入字典类型标识",
		},
	},
	{
		label: "字典分类",
		prop: "dictionaryCategory",
		valueType: "select",
		width: "180px",
		required: true,
		options: dictionaryCategoryOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择字典分类",
		},
	},
	{
		label: "数据类型",
		prop: "dataType",
		valueType: "select",
		width: "150px",
		required: true,
		options: dataTypeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择数据类型",
		},
	},
	{
		label: "默认值",
		prop: "defaultValue",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入默认值",
		},
	},
	{
		label: "是否必填",
		prop: "isRequired",
		valueType: "select",
		width: "120px",
		required: true,
		options: requiredOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择是否必填",
		},
	},
	{
		label: "验证规则",
		prop: "validationRule",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入验证规则（正则表达式或验证函数）",
			rows: 3,
		},
	},
	{
		label: "显示顺序",
		prop: "displayOrder",
		valueType: "input-number",
		width: "150px",
		required: true,
		fieldProps: {
			min: 0,
			max: 9999,
			precision: 0,
			placeholder: "请输入显示顺序",
		},
	},
	{
		label: "字典状态",
		prop: "status",
		valueType: "select",
		width: "120px",
		required: true,
		options: dictionaryTypeStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择字典状态",
		},
	},
	{
		label: "备注",
		prop: "remark",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
			rows: 3,
		},
	},
]);

/** 表单项配置 动态计算 只读 Computed form columns */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 Form validation rules */
const plusFormRules = ref<PlusFormRules>({
	dictionaryNumber: [
		{ required: true, message: "请输入字典编号", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
		{ pattern: /^[A-Za-z0-9_]+$/, message: "只能包含字母、数字和下划线", trigger: "blur" },
	],
	dictionaryName: [
		{ required: true, message: "请输入字典名称", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
	],
	dictionaryType: [
		{ required: true, message: "请输入字典类型", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
		{ pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: "必须以字母开头，只能包含字母、数字和下划线", trigger: "blur" },
	],
	dictionaryCategory: [{ required: true, message: "请选择字典分类", trigger: "change" }],
	dataType: [{ required: true, message: "请选择数据类型", trigger: "change" }],
	isRequired: [{ required: true, message: "请选择是否必填", trigger: "change" }],
	displayOrder: [
		{ required: true, message: "请输入显示顺序", trigger: "blur" },
		{ type: "number", min: 0, max: 9999, message: "显示顺序必须在 0 到 9999 之间", trigger: "blur" },
	],
	status: [{ required: true, message: "请选择字典状态", trigger: "change" }],
});

defineExpose({
	plusFormInstance,
	formComputed,
});
</script>

<template>
	<section class="form-root">
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			:has-footer="false"
			:default-values="defaultValues"
			:columns="plusFormColumnsComputed"
			:rules="plusFormRules"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
