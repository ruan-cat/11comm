<!--
  字典类型表单
  用于新增、修改字典类型
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { DictionaryTypeFormProps, 数据类型, 字典类型分类, 字典类型表单_VO, defaultForm } from "./form";

const props = defineProps<DictionaryTypeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 字典类型表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 字典类型表单_VO;

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
	// 字典编号
	{
		label: "字典编号",
		prop: "字典编号",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入字典编号",
		},
	},

	// 字典名称
	{
		label: "字典名称",
		prop: "字典名称",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入字典名称",
		},
	},

	// 字典类型
	{
		label: "字典类型",
		prop: "字典类型",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入字典类型标识",
		},
	},

	// 字典分类
	{
		label: "字典分类",
		prop: "字典分类",
		valueType: "select",
		width: "180px",
		required: true,
		options: [
			{ label: "系统字典", value: "系统字典" },
			{ label: "业务字典", value: "业务字典" },
			{ label: "自定义字典", value: "自定义字典" },
			{ label: "第三方字典", value: "第三方字典" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择字典分类",
		},
	},

	// 数据类型
	{
		label: "数据类型",
		prop: "数据类型",
		valueType: "select",
		width: "150px",
		required: true,
		options: [
			{ label: "字符串", value: "字符串" },
			{ label: "数字", value: "数字" },
			{ label: "布尔值", value: "布尔值" },
			{ label: "日期", value: "日期" },
			{ label: "时间", value: "时间" },
			{ label: "日期时间", value: "日期时间" },
			{ label: "JSON对象", value: "JSON对象" },
			{ label: "数组", value: "数组" },
			{ label: "文件", value: "文件" },
			{ label: "邮箱", value: "邮箱" },
			{ label: "手机号", value: "手机号" },
			{ label: "URL", value: "URL" },
			{ label: "密码", value: "密码" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择数据类型",
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

	// 是否必填
	{
		label: "是否必填",
		prop: "是否必填",
		valueType: "select",
		width: "120px",
		required: true,
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择是否必填",
		},
	},

	// 验证规则
	{
		label: "验证规则",
		prop: "验证规则",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入验证规则（正则表达式或验证函数）",
			rows: 3,
		},
	},

	// 显示顺序
	{
		label: "显示顺序",
		prop: "显示顺序",
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

	// 字典状态
	{
		label: "字典状态",
		prop: "字典状态",
		valueType: "select",
		width: "120px",
		required: true,
		options: [
			{ label: "启用", value: "启用" },
			{ label: "禁用", value: "禁用" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择字典状态",
		},
	},

	// 备注
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
			rows: 3,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	字典编号: [
		{ required: true, message: "请输入字典编号", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
		{ pattern: /^[A-Za-z0-9_]+$/, message: "只能包含字母、数字和下划线", trigger: "blur" },
	],
	字典名称: [
		{ required: true, message: "请输入字典名称", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
	],
	字典类型: [
		{ required: true, message: "请输入字典类型", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
		{ pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: "必须以字母开头，只能包含字母、数字和下划线", trigger: "blur" },
	],
	字典分类: [{ required: true, message: "请选择字典分类", trigger: "change" }],
	数据类型: [{ required: true, message: "请选择数据类型", trigger: "change" }],
	是否必填: [{ required: true, message: "请选择是否必填", trigger: "change" }],
	显示顺序: [
		{ required: true, message: "请输入显示顺序", trigger: "blur" },
		{ type: "number", min: 0, max: 9999, message: "显示顺序必须在 0 到 9999 之间", trigger: "blur" },
	],
	字典状态: [{ required: true, message: "请选择字典状态", trigger: "change" }],
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