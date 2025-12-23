<!--
  系统配置表单
  用于新增 修改系统配置
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import {
	SystemConfigFormProps,
	type SystemConfigFormVO,
	defaultForm,
	systemConfigTypeOptionsAlias,
	configGroupOptions,
	systemConfigStatusOptions,
} from "./form";

const props = defineProps<SystemConfigFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & SystemConfigFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & SystemConfigFormVO;

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
	// 配置名称
	{
		label: "配置名称",
		prop: "configName",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置名称",
			maxlength: 50,
		},
	},

	// 配置值
	{
		label: "配置值",
		prop: "configValue",
		valueType: "textarea",
		width: "300px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置值",
			rows: 3,
			maxlength: 1000,
		},
	},

	// 配置类型
	{
		label: "配置类型",
		prop: "configType",
		valueType: "select",
		width: "150px",
		required: true,
		options: systemConfigTypeOptionsAlias,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择配置类型",
		},
	},

	// 配置分组
	{
		label: "配置分组",
		prop: "configGroup",
		valueType: "select",
		width: "150px",
		required: true,
		options: configGroupOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择配置分组",
		},
	},

	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		width: "120px",
		required: true,
		options: systemConfigStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},

	// 描述
	{
		label: "描述",
		prop: "description",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置描述信息",
			rows: 4,
			maxlength: 200,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	configName: [
		{ required: true, message: "请填写配置名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	configValue: [
		{ required: true, message: "请填写配置值", trigger: "blur" },
		{ min: 1, max: 1000, message: "长度在 1 到 1000 个字符", trigger: "blur" },
	],
	configType: [{ required: true, message: "请选择配置类型", trigger: "change" }],
	configGroup: [{ required: true, message: "请选择配置分组", trigger: "change" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
	description: [{ max: 200, message: "描述长度不能超过200个字符", trigger: "blur" }],
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
