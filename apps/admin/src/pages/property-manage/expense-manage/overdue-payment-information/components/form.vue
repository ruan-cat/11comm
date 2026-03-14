<script lang="ts" setup>
import { useTemplateRef, ref, computed } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { OverduePaymentInformationFormVO } from "@01s-11comm/type";
import { chargeObjectOptions, overduePaymentStatusOptions } from "@01s-11comm/type";

import { OverduePaymentInformationFormProps } from "./form";

/** 表单组件的 props */
const props = defineProps<OverduePaymentInformationFormProps>();

const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OverduePaymentInformationFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & OverduePaymentInformationFormVO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递，扩展欠费时间范围字段
 */
const form = ref({
	...toRefForm,
	overdueTimeRange: toRefForm.startTime && toRefForm.endTime ? [toRefForm.startTime, toRefForm.endTime] : ["", ""],
});

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return {
		...form.value,
		startTime: form.value.overdueTimeRange?.[0] || "",
		endTime: form.value.overdueTimeRange?.[1] || "",
	};
});

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.form.fields.chargeObject")),
		prop: "chargeObject",
		valueType: "select",
		options: chargeObjectOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		width: "200px",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.form.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.placeholders.ownerName"),
			),
		},
		width: "200px",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.form.fields.phoneNumber")),
		prop: "phoneNumber",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.placeholders.phoneNumber"),
			),
		},
		width: "200px",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.form.fields.contactAddress")),
		prop: "contactAddress",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.placeholders.contactAddress"),
			),
		},
		width: "300px",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.form.fields.overdueTimeRange")),
		prop: "overdueTimeRange",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			startPlaceholder: "开始日期",
			endPlaceholder: "结束日期",
		},
		width: "280px",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.form.fields.overdueAmount")),
		prop: "overdueAmount",
		valueType: "input-number",
		fieldProps: {
			precision: 2,
			min: 0,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.placeholders.overdueAmount"),
			),
		},
		width: "200px",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.overdue-payment-information.form.fields.paymentStatus")),
		prop: "paymentStatus",
		valueType: "select",
		options: overduePaymentStatusOptions,
		fieldProps: {
			clearable: true,
		},
		width: "150px",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.overdue-payment-information.form.fields.overdueDescription"),
		),
		prop: "overdueDescription",
		valueType: "textarea",
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.placeholders.overdueDescription"),
			),
			rows: 3,
			maxlength: 200,
			showWordLimit: true,
		},
		width: "400px",
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	chargeObject: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.validation.chargeObjectRequired"),
			),
			trigger: "change",
		},
	],
	ownerName: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.validation.ownerNameRequired"),
			),
			trigger: "blur",
		},
		{
			min: 2,
			max: 20,
			message: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.validation.ownerNameLength"),
			),
			trigger: "blur",
		},
	],
	phoneNumber: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.validation.phoneNumberRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.validation.phoneNumberFormat"),
			),
			trigger: "blur",
		},
	],
	overdueTimeRange: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.validation.overdueTimeRangeRequired"),
			),
			trigger: "change",
		},
	],
	overdueAmount: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.validation.overdueAmountRequired"),
			),
			trigger: "blur",
		},
	],
	paymentStatus: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.overdue-payment-information.form.validation.paymentStatusRequired"),
			),
			trigger: "change",
		},
	],
}));

// 默认导出，供外部使用
defineExpose({
	plusFormInstance,
	formComputed,
});
</script>

<template>
	<section :key="locale" class="form-root">
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			:has-footer="false"
			:default-values="defaultValues"
			:columns="plusFormColumns"
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
