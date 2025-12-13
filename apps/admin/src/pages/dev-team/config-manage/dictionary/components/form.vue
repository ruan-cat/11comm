<!--
  字典表单
  用于新增修改字典
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { DictionaryFormProps, DictionaryFormVO } from "./form";

const props = defineProps<DictionaryFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & DictionaryFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = cloneDeep(props.form) as FieldValues & DictionaryFormVO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(toRefForm);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	// 字典名称
	{
		label: "字典名称",
		prop: "dictionaryName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},

	// 字典编码
	{
		label: "字典编码",
		prop: "dictionaryCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},

	// 字典类型
	{
		label: "字典类型",
		prop: "dictionaryType",
		valueType: "select",
		options: 字典类型选项,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		required: true,
	},

	// 字典描述
	{
		label: "字典描述",
		prop: "dictionaryDescription",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},

	// 是否启用
	{
		label: "是否启用",
		prop: "isEnabled",
		valueType: "select",
		options: 是否启用选项,
		fieldProps: {
			clearable: true,
		},
		required: true,
	},

	// 备注
	{
		label: "备注",
		prop: "remark",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	dictionaryName: [
		{ required: true, message: "请输入字典名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	dictionaryCode: [
		{ required: true, message: "请输入字典编码", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
		{ pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: "编码只能包含字母、数字、下划线，且不能以数字开头", trigger: "blur" },
	],
	dictionaryType: [
		{ required: true, message: "请选择字典类型", trigger: "change" },
	],
	isEnabled: [
		{ required: true, message: "请选择是否启用", trigger: "change" },
	],
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