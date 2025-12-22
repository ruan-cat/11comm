<!--
  配置中心表单
  用于新增、修改配置中心数据
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { ConfigCenterFormProps, ConfigCenterFormVO, defaultForm, configTypeOptions, configStatusOptions } from "./form";

const props = defineProps<ConfigCenterFormProps>();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & ConfigCenterFormVO;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = structuredClone(props.form) as FieldValues & ConfigCenterFormVO;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 Form columns configuration */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "配置项名称",
		prop: "configName",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置项名称",
		},
	},
	{
		label: "配置类型",
		prop: "configType",
		valueType: "select",
		required: true,
		width: "180px",
		options: configTypeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择配置类型",
		},
	},
	{
		label: "配置键名",
		prop: "configKey",
		valueType: "input",
		required: true,
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置键名（如：system.name）",
		},
	},
	{
		label: "配置值",
		prop: "configValue",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置值",
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
		label: "配置描述",
		prop: "configDescription",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置描述信息",
			rows: 3,
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		required: true,
		width: "120px",
		options: configStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},
	{
		label: "排序号",
		prop: "sortOrder",
		valueType: "input-number",
		width: "150px",
		fieldProps: {
			placeholder: "请输入排序号",
			min: 0,
			max: 9999,
		},
	},
	{
		label: "备注",
		prop: "remark",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
			rows: 2,
		},
	},
]);

/** 表单项配置 动态计算 只读 Computed form columns */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 Form validation rules */
const plusFormRules = ref<PlusFormRules>({
	configName: [
		{ required: true, message: "请输入配置项名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	configType: [{ required: true, message: "请选择配置类型", trigger: "change" }],
	configKey: [
		{ required: true, message: "请输入配置键名", trigger: "blur" },
		{
			pattern: /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/,
			message: "配置键名格式不正确，应为字母、数字、点、下划线组合",
			trigger: "blur",
		},
	],
	configValue: [{ required: true, message: "请输入配置值", trigger: "blur" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
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
