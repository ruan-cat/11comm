<!--
  配置中心表单
  用于新增、修改配置中心数据
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { ConfigCenterFormProps, 配置中心表单_VO, defaultForm, 配置类型, 配置状态 } from "./form";

const props = defineProps<ConfigCenterFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 配置中心表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 配置中心表单_VO;

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
	// 配置项名称
	{
		label: "配置项名称",
		prop: "配置项名称",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置项名称",
		},
	},

	// 配置类型
	{
		label: "配置类型",
		prop: "配置类型",
		valueType: "select",
		required: true,
		width: "180px",
		options: [
			{ label: "系统配置", value: "系统配置" },
			{ label: "业务配置", value: "业务配置" },
			{ label: "接口配置", value: "接口配置" },
			{ label: "数据库配置", value: "数据库配置" },
			{ label: "缓存配置", value: "缓存配置" },
			{ label: "安全配置", value: "安全配置" },
			{ label: "邮件配置", value: "邮件配置" },
			{ label: "文件配置", value: "文件配置" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择配置类型",
		},
	},

	// 配置键名
	{
		label: "配置键名",
		prop: "配置键名",
		valueType: "input",
		required: true,
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置键名（如：system.name）",
		},
	},

	// 配置值
	{
		label: "配置值",
		prop: "配置值",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置值",
		},
	},

	// 默认值
	{
		label: "默认值",
		prop: "默认值",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入默认值",
		},
	},

	// 配置描述
	{
		label: "配置描述",
		prop: "配置描述",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入配置描述信息",
			rows: 3,
		},
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		required: true,
		width: "120px",
		options: [
			{ label: "启用", value: "启用" },
			{ label: "禁用", value: "禁用" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},

	// 排序号
	{
		label: "排序号",
		prop: "排序号",
		valueType: "input-number",
		width: "150px",
		fieldProps: {
			placeholder: "请输入排序号",
			min: 0,
			max: 9999,
		},
	},

	// 备注
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
			rows: 2,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	配置项名称: [
		{ required: true, message: "请输入配置项名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	配置类型: [{ required: true, message: "请选择配置类型", trigger: "change" }],
	配置键名: [
		{ required: true, message: "请输入配置键名", trigger: "blur" },
		{
			pattern: /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/,
			message: "配置键名格式不正确，应为字母、数字、点、下划线组合",
			trigger: "blur",
		},
	],
	配置值: [{ required: true, message: "请输入配置值", trigger: "blur" }],
	状态: [{ required: true, message: "请选择状态", trigger: "change" }],
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