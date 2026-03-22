<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import type { ArrearsDetailsFormProps } from "./form";

const props = defineProps<ArrearsDetailsFormProps>();


/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ArrearsDetailsFormProps["form"];

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
const toRefForm = cloneDeep(props.form) as FieldValues & ArrearsDetailsFormProps["form"];

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
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.feeNumber")),
		prop: "feeNumber",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.roomNumber")),
		prop: "roomNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.owner")),
		prop: "owner",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.ownerPhone")),
		prop: "ownerPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.area")),
		prop: "area",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.feeItem")),
		prop: "feeItem",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.startTime")),
		prop: "startTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.endTime")),
		prop: "endTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.arrearsDuration")),
		prop: "arrearsDuration",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.form.fields.arrearsAmount")),
		prop: "arrearsAmount",
		valueType: "input",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	roomNumber: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_report-manage.arrears-details-list.form.validation.roomNumberRequired"),
			),
			trigger: "blur",
		},
	],
	owner: [
		{
			required: true,
			message: transformI18n($t("property-manage_report-manage.arrears-details-list.form.validation.ownerRequired")),
			trigger: "blur",
		},
	],
	ownerPhone: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_report-manage.arrears-details-list.form.validation.ownerPhoneRequired"),
			),
			trigger: "blur",
		},
	],
	feeItem: [
		{
			required: true,
			message: transformI18n($t("property-manage_report-manage.arrears-details-list.form.validation.feeItemRequired")),
			trigger: "blur",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_report-manage.arrears-details-list.form.validation.startTimeRequired"),
			),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_report-manage.arrears-details-list.form.validation.endTimeRequired")),
			trigger: "change",
		},
	],
	arrearsAmount: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_report-manage.arrears-details-list.form.validation.arrearsAmountRequired"),
			),
			trigger: "blur",
		},
	],
}));

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
