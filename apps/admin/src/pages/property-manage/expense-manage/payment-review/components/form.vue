<!--
  缴费审核表单
  用于审核缴费记录
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { PaymentReviewFormVO } from "@01s-11comm/type";

import { PaymentReviewFormProps, defaultForm } from "./form";

const props = defineProps<PaymentReviewFormProps>();

const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PaymentReviewFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & PaymentReviewFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedExpenseItemOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.options.expenseItem.propertyFee")),
		value: "物业费",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.options.expenseItem.parkingFee")),
		value: "停车费",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.options.expenseItem.utilityFee")),
		value: "水电费",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.options.expenseItem.gasFee")),
		value: "燃气费",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.options.expenseItem.heatingFee")),
		value: "暖气费",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.options.expenseItem.otherFee")),
		value: "其他费用",
	},
]);

const translatedAuditStatusOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.options.auditStatus.pending")),
		value: "待审核",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.options.auditStatus.approved")),
		value: "审核通过",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.options.auditStatus.rejected")),
		value: "审核拒绝",
	},
]);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.house")),
		prop: "house",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.house")),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.expenseItem")),
		prop: "expenseItem",
		valueType: "select",
		width: "140px",
		options: translatedExpenseItemOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.expenseItem")),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.paymentPeriod")),
		prop: "paymentPeriod",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.paymentPeriod")),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.paymentStartTime")),
		prop: "paymentStartTime",
		valueType: "date-picker",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.payment-review.form.placeholders.paymentStartTime"),
			),
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.paymentEndTime")),
		prop: "paymentEndTime",
		valueType: "date-picker",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.paymentEndTime")),
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.payableAmount")),
		prop: "payableAmount",
		valueType: "input",
		width: "140px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.payableAmount")),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.paidAmount")),
		prop: "paidAmount",
		valueType: "input",
		width: "140px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.paidAmount")),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.operator")),
		prop: "operator",
		valueType: "input",
		width: "140px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.operator")),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.paymentTime")),
		prop: "paymentTime",
		valueType: "date-picker",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.paymentTime")),
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.auditStatus")),
		prop: "auditStatus",
		valueType: "select",
		width: "140px",
		options: translatedAuditStatusOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.auditStatus")),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.auditDescription")),
		prop: "auditDescription",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.payment-review.form.placeholders.auditDescription"),
			),
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.paymentRemark")),
		prop: "paymentRemark",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.paymentRemark")),
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.payment-review.form.fields.details")),
		prop: "details",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.payment-review.form.placeholders.details")),
			rows: 4,
			maxlength: 1000,
			showWordLimit: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	house: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.houseRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 20,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.houseLength")),
			trigger: "blur",
		},
	],
	expenseItem: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.expenseItemRequired")),
			trigger: "change",
		},
	],
	paymentPeriod: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.paymentPeriodRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.paymentPeriodLength")),
			trigger: "blur",
		},
	],
	paymentStartTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.payment-review.form.validation.paymentStartTimeRequired"),
			),
			trigger: "change",
		},
	],
	paymentEndTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.payment-review.form.validation.paymentEndTimeRequired"),
			),
			trigger: "change",
		},
	],
	payableAmount: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.payableAmountRequired")),
			trigger: "blur",
		},
		{
			pattern: /^\d+(\.\d{1,2})?$/,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.payableAmountFormat")),
			trigger: "blur",
		},
	],
	paidAmount: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.paidAmountRequired")),
			trigger: "blur",
		},
		{
			pattern: /^\d+(\.\d{1,2})?$/,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.paidAmountFormat")),
			trigger: "blur",
		},
	],
	operator: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.operatorRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 10,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.operatorLength")),
			trigger: "blur",
		},
	],
	paymentTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.paymentTimeRequired")),
			trigger: "change",
		},
	],
	auditStatus: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.auditStatusRequired")),
			trigger: "change",
		},
	],
	auditDescription: [
		{
			max: 500,
			message: transformI18n(
				$t("property-manage_expense-manage.payment-review.form.validation.auditDescriptionLength"),
			),
			trigger: "blur",
		},
	],
	paymentRemark: [
		{
			max: 500,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.paymentRemarkLength")),
			trigger: "blur",
		},
	],
	details: [
		{
			max: 1000,
			message: transformI18n($t("property-manage_expense-manage.payment-review.form.validation.detailsLength")),
			trigger: "blur",
		},
	],
}));

/** 默认对外导出函数 */
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
