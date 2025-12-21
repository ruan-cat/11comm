<!--
  注册协议表单
  用于新增和编辑注册协议
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import {
	RegisterProtocolFormProps,
	注册协议表单_VO,
	defaultForm,
	协议类型Options,
	状态Options,
	是否强制同意Options,
} from "./form";

const props = defineProps<RegisterProtocolFormProps>();

/** 表单组件所需的默认值 */
const defaultValues = props.defaultValues as FieldValues & 注册协议表单_VO;

/** 表单组件的 ref 引用，用于表单重置等操作 */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 拷贝表单数据 避免直接修改 props 的 form 数据
 * @description
 * 为了满足表单组件的校验需求 这里需要额外拓展为索引类型
 *
 * 具体原因请看：https://pure-admin-utils.netlify.app/guide/form-plus.html#表单校验
 */
const toRefForm = cloneDeep(props.form) as FieldValues & 注册协议表单_VO;

/**
 * 表单数据
 * @description
 * 真正的表单数据，响应式数据
 */
const form = ref(toRefForm);
/** 计算属性表单数据（只读，用于表单重置时比较） */
const formComputed = computed(() => {
	return form.value;
});

/** 表单列配置 */
const plusFormColumns = ref<PlusColumn[]>([
	// 协议名称
	{
		label: "协议名称",
		prop: "协议名称",
		valueType: "input",
		required: true,
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入协议名称",
			maxlength: 100,
		},
	},

	// 协议类型
	{
		label: "协议类型",
		prop: "协议类型",
		valueType: "select",
		required: true,
		width: "200px",
		options: 协议类型Options,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择协议类型",
		},
	},

	// 协议版本
	{
		label: "协议版本",
		prop: "协议版本",
		valueType: "input",
		required: true,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "如v1.0.0",
		},
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		required: true,
		width: "150px",
		options: 状态Options,
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},

	// 是否强制同意
	{
		label: "是否强制同意",
		prop: "是否强制同意",
		valueType: "select",
		required: true,
		width: "150px",
		options: 是否强制同意Options,
		fieldProps: {
			clearable: true,
			placeholder: "请选择是否强制同意",
		},
	},

	// 生效日期
	{
		label: "生效日期",
		prop: "生效日期",
		valueType: "date-picker",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			type: "date",
			placeholder: "请选择生效日期",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
			disabledDate: (time: Date) => {
				return time.getTime() < Date.now() - 8.64e7; // 不能选择今天之前的日期
			},
		},
	},

	// 失效日期
	{
		label: "失效日期",
		prop: "失效日期",
		valueType: "date-picker",
		width: "200px",
		fieldProps: {
			clearable: true,
			type: "date",
			placeholder: "请选择或留空表示永久生效",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
			disabledDate: (time: Date, formValues: any) => {
				if (formValues?.生效日期) {
					return time.getTime() <= new Date(formValues.生效日期).getTime();
				}
				return false;
			},
		},
	},

	// 排序权重
	{
		label: "排序权重",
		prop: "排序权重",
		valueType: "input-number",
		width: "150px",
		fieldProps: {
			placeholder: "数字越小排序越靠前",
			min: 0,
			max: 9999,
			controls: true,
		},
	},

	// 协议摘要
	{
		label: "协议摘要",
		prop: "协议摘要",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			placeholder: "请输入协议摘要，最多500字",
			maxlength: 500,
			showWordLimit: true,
			rows: 3,
			resize: "vertical",
		},
	},

	// 协议内容
	{
		label: "协议内容",
		prop: "协议内容",
		valueType: "textarea",
		required: true,
		width: "100%",
		fieldProps: {
			placeholder: "请输入协议内容，支持HTML格式，最少100字，最多50000字",
			maxlength: 50000,
			showWordLimit: true,
			rows: 15,
			resize: "vertical",
		},
	},
]);

/** 表单列配置 计算属性，便于后续动态修改 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	协议名称: [
		{ required: true, message: "请输入协议名称", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
	],
	协议类型: [{ required: true, message: "请选择协议类型", trigger: "change" }],
	协议版本: [
		{ required: true, message: "请输入协议版本", trigger: "blur" },
		{
			pattern: /^v?\d+\.\d+\.\d+$/,
			message: "版本号格式不正确，请输入如 v1.0.0 的格式",
			trigger: "blur",
		},
	],
	状态: [{ required: true, message: "请选择状态", trigger: "change" }],
	是否强制同意: [{ required: true, message: "请选择是否强制同意", trigger: "change" }],
	协议内容: [
		{ required: true, message: "请输入协议内容", trigger: "blur" },
		{ min: 100, message: "协议内容至少100个字符", trigger: "blur" },
	],
	生效日期: [{ required: true, message: "请选择生效日期", trigger: "change" }],
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
