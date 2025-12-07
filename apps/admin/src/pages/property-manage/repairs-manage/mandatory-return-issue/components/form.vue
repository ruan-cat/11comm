<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "lodash-es";
import { MandatoryReturnIssueFormProps, type 强制回单表单_VO } from "./form";
import { 报修类型Options, 状态Options } from "../test-data";

const props = defineProps<MandatoryReturnIssueFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 强制回单表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 强制回单表单_VO;

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
	{
		label: "工单编号",
		prop: "工单编号",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "位置",
		prop: "位置",
		valueType: "input",
	},
	{
		label: "报修类型",
		prop: "报修类型",
		valueType: "select",
		options: 报修类型Options,
	},
	{
		label: "报修人",
		prop: "报修人",
		valueType: "input",
	},
	{
		label: "联系方式",
		prop: "联系方式",
		valueType: "input",
	},
	{
		label: "预约时间",
		prop: "预约时间",
		valueType: "date-picker",
	},
	{
		label: "提交时间",
		prop: "提交时间",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态Options,
	},
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	位置: [
		{
			required: true,
			message: "请输入位置",
			trigger: "blur",
		},
	],
	报修类型: [
		{
			required: true,
			message: "请选择报修类型",
			trigger: "change",
		},
	],
	报修人: [
		{
			required: true,
			message: "请输入报修人",
			trigger: "blur",
		},
	],
	联系方式: [
		{
			required: true,
			message: "请输入联系方式",
			trigger: "blur",
		},
	],
	状态: [
		{
			required: true,
			message: "请选择状态",
			trigger: "change",
		},
	],
});

/** 动态计算的表单项配置 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 对外导出 */
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
