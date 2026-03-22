<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { HouseChargeFormVO } from "@01s-11comm/type";
import {
	discountTypeOptions,
	paymentTypeOptions,
	accountDeductionOptions,
	mobilePaymentOptions,
	roundingMethodOptions,
	decimalPlacesOptions,
	statusOptions,
} from "@01s-11comm/type";
import { type FieldValues, type PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";

import { HouseChargeFormProps, defaultForm } from "./form";

const props = defineProps<HouseChargeFormProps>();
const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & HouseChargeFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & HouseChargeFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		/** 费用类型 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.expenseType")),
		prop: "expenseType",
		valueType: "select",
		options: [
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.propertyFee")),
				value: "物业费",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.deposit")),
				value: "押金",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.parkingFee")),
				value: "停车费",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.gasFee")),
				value: "煤气费",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.heatingFee")),
				value: "取暖费",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.maintenanceFee")),
				value: "维修费",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.serviceFee")),
				value: "服务费",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.other")),
				value: "其他",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.waterFee")),
				value: "水费",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.electricityFee")),
				value: "电费",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.rent")),
				value: "租金",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseType.publicShareFee")),
				value: "公摊费",
			},
		],
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		/** 收费项目 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.expenseItem")),
		prop: "expenseItem",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 费用标识 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.expenseIdentifier")),
		prop: "expenseIdentifier",
		valueType: "select",
		options: [
			{
				label: transformI18n(
					$t("property-manage_expense-manage.house-charge.form.options.expenseIdentifier.recurring"),
				),
				value: "周期性费用",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.expenseIdentifier.oneTime")),
				value: "一次性费用",
			},
		],
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 付费类型 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.paymentType")),
		prop: "paymentType",
		valueType: "select",
		options: [
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.paymentType.prepaid")),
				value: "预付费",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.paymentType.postpaid")),
				value: "后付费",
			},
		],
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 缴费周期 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.paymentCycle")),
		prop: "缴费周期(单位:月)",
		valueType: "input",
		required: true,
		hidden: (form) => form.费用类型 === "押金",
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 预付期 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.prepaymentPeriod")),
		prop: "预付期(单位:天)",
		valueType: "input",
		required: true,
		hidden: (form) => form.费用类型 === "煤气费",
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 单位 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.unit")),
		prop: "unit",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 账户抵扣 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.accountDeduction")),
		prop: "accountDeduction",
		valueType: "select",
		options: [
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.accountDeduction.yes")),
				value: "是",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.accountDeduction.no")),
				value: "否",
			},
		],
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 手机缴费 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.mobilePayment")),
		prop: "mobilePayment",
		valueType: "select",
		options: [
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.mobilePayment.yes")),
				value: "是",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.mobilePayment.no")),
				value: "否",
			},
		],
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 进位方式 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.roundingMode")),
		prop: "roundingMode",
		valueType: "select",
		options: [
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.roundingMode.round")),
				value: "四舍五入",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.roundingMode.ceil")),
				value: "向上取整",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.roundingMode.floor")),
				value: "向下取整",
			},
		],
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 保留小数位 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.decimalPlaces")),
		prop: "decimalPlaces",
		valueType: "select",
		options: [
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.decimalPlaces.integer")),
				value: "取整",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.decimalPlaces.one")),
				value: "1位",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.decimalPlaces.two")),
				value: "2位",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.decimalPlaces.three")),
				value: "3位",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.decimalPlaces.four")),
				value: "4位",
			},
		],
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 状态 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.status")),
		prop: "status",
		valueType: "select",
		options: [
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.status.enabled")),
				value: "启用",
			},
			{
				label: transformI18n($t("property-manage_expense-manage.house-charge.form.options.status.disabled")),
				value: "禁用",
			},
		],
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 计算公式 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.formula")),
		prop: "formula",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 计费单价 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.billingUnitPrice")),
		prop: "billingUnitPrice",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	{
		/** 固定费用 */
		label: transformI18n($t("property-manage_expense-manage.house-charge.form.fields.fixedFee")),
		prop: "fixedFee",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	expenseType: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.expenseTypeRequired")),
			trigger: "change",
		},
	],
	expenseItem: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.expenseItemRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.expenseItemLength")),
			trigger: "blur",
		},
	],
	expenseIdentifier: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.house-charge.form.validation.expenseIdentifierRequired"),
			),
			trigger: "change",
		},
	],
	paymentType: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.paymentTypeRequired")),
			trigger: "change",
		},
	],
	paymentCycle: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.paymentCycleRequired")),
			trigger: "blur",
		},
		{
			pattern: /^[1-9]\d*$/,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.paymentCycleFormat")),
			trigger: "blur",
		},
	],
	prepaymentPeriod: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.house-charge.form.validation.prepaymentPeriodRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^[1-9]\d*$/,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.prepaymentPeriodFormat")),
			trigger: "blur",
		},
	],
	unit: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.unitRequired")),
			trigger: "blur",
		},
		{
			min: 1,
			max: 20,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.unitLength")),
			trigger: "blur",
		},
	],
	accountDeduction: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.house-charge.form.validation.accountDeductionRequired"),
			),
			trigger: "change",
		},
	],
	mobilePayment: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.mobilePaymentRequired")),
			trigger: "change",
		},
	],
	roundingMode: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.roundingModeRequired")),
			trigger: "change",
		},
	],
	decimalPlaces: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.decimalPlacesRequired")),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.statusRequired")),
			trigger: "change",
		},
	],
	formula: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.formulaRequired")),
			trigger: "blur",
		},
	],
	billingUnitPrice: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.house-charge.form.validation.billingUnitPriceRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^[0-9]+(\.[0-9]{1,4})?$/,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.billingUnitPriceFormat")),
			trigger: "blur",
		},
	],
	fixedFee: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.fixedFeeRequired")),
			trigger: "blur",
		},
		{
			pattern: /^[0-9]+(\.[0-9]{1,4})?$/,
			message: transformI18n($t("property-manage_expense-manage.house-charge.form.validation.fixedFeeFormat")),
			trigger: "blur",
		},
	],
}));

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
