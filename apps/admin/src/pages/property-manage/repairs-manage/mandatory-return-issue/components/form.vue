<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import { MandatoryReturnIssueFormProps } from "./form";
import type { MandatoryReturnIssueFormVO } from "@01s-11comm/type";
import { repairTypeOptions, mandatoryReturnIssueStatusOptions } from "@01s-11comm/type";

const props = defineProps<MandatoryReturnIssueFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & MandatoryReturnIssueFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & MandatoryReturnIssueFormVO;

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
		prop: "workOrderNumber",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "位置",
		prop: "location",
		valueType: "input",
	},
	{
		label: "报修类型",
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: "报修人",
		prop: "reporter",
		valueType: "input",
	},
	{
		label: "联系方式",
		prop: "contactInfo",
		valueType: "input",
	},
	{
		label: "预约时间",
		prop: "appointmentTime",
		valueType: "date-picker",
	},
	{
		label: "提交时间",
		prop: "submitTime",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: mandatoryReturnIssueStatusOptions,
	},
	{
		label: "备注",
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	location: [
		{
			required: true,
			message: "请输入位置",
			trigger: "blur",
		},
	],
	repairType: [
		{
			required: true,
			message: "请选择报修类型",
			trigger: "change",
		},
	],
	reporter: [
		{
			required: true,
			message: "请输入报修人",
			trigger: "blur",
		},
	],
	contactInfo: [
		{
			required: true,
			message: "请输入联系方式",
			trigger: "blur",
		},
	],
	status: [
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
