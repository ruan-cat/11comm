<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { ExpenseItemFeeType, ExpenseItemSettingFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { ExpenseItemSettingFormProps, defaultForm } from "./form";

const props = defineProps<ExpenseItemSettingFormProps>();

const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ExpenseItemSettingFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & ExpenseItemSettingFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedExpenseIdentifierOptions = withLocale(() => [
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-item-setting.form.options.expenseIdentifier.recurring"),
		),
		value: "周期性费用",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-item-setting.form.options.expenseIdentifier.oneTime"),
		),
		value: "一次性费用",
	},
]);

const translatedPaymentTypeOptions = withLocale(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.paymentType.prepaid")),
		value: "预付费",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.paymentType.postpaid")),
		value: "后付费",
	},
]);

const translatedAccountDeductionOptions = withLocale(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.accountDeduction.yes")),
		value: "是",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.accountDeduction.no")),
		value: "否",
	},
]);

const translatedMobilePaymentOptions = withLocale(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.mobilePayment.yes")),
		value: "是",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.mobilePayment.no")),
		value: "否",
	},
]);

const translatedRoundingModeOptions = withLocale(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.roundingMode.round")),
		value: "四舍五入",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.roundingMode.ceil")),
		value: "向上取整",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.roundingMode.floor")),
		value: "向下取整",
	},
]);

const translatedDecimalPlacesOptions = withLocale(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.decimalPlaces.integer")),
		value: "取整",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.decimalPlaces.one")),
		value: "1位",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.decimalPlaces.two")),
		value: "2位",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.decimalPlaces.three")),
		value: "3位",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.decimalPlaces.four")),
		value: "4位",
	},
]);

const translatedStatusOptions = withLocale(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.status.enabled")),
		value: "启用",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.options.status.disabled")),
		value: "禁用",
	},
]);

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	// 费用类型
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.feeType")),
		prop: "feeType",
	},

	// 收费项目
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.expenseItem")),
		prop: "expenseItem",
		valueType: "input",
		required: true,
	},

	// 费用标识
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.expenseIdentifier")),
		prop: "expenseIdentifier",
		valueType: "select",
		options: translatedExpenseIdentifierOptions.value,
		required: true,
	},

	// 付费类型
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.paymentType")),
		prop: "paymentType",
		valueType: "select",
		options: translatedPaymentTypeOptions.value,
		required: true,
	},
	// 缴费周期
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.paymentCycle")),
		prop: "paymentCycle",
		valueType: "input",
		required: true,
		hidden: (form: ExpenseItemSettingFormVO) => form.feeType === "押金",
	},
	// 预付期
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.prepaymentPeriod")),
		prop: "prepaymentPeriod",
		valueType: "input",
		required: true,
		hidden: (form: ExpenseItemSettingFormVO) => form.feeType === "煤气费",
	},
	// 单位
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.unit")),
		prop: "unit",
		valueType: "input",
		required: true,
	},
	// 账户抵扣
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.accountDeduction")),
		prop: "accountDeduction",
		valueType: "select",
		options: translatedAccountDeductionOptions.value,
		required: true,
	},
	// 手机缴费
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.mobilePayment")),
		prop: "mobilePayment",
		valueType: "select",
		options: translatedMobilePaymentOptions.value,
		required: true,
	},
	// 进位方式
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.roundingMode")),
		prop: "roundingMode",
		valueType: "select",
		options: translatedRoundingModeOptions.value,
		required: true,
	},
	// 保留小数位
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.decimalPlaces")),
		prop: "decimalPlaces",
		valueType: "select",
		options: translatedDecimalPlacesOptions.value,
		required: true,
	},
	// 状态
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		required: true,
	},
	// 计算公式
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.formula")),
		prop: "formula",
		valueType: "input",
		required: true,
	},
	// 计费单价
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.billingUnitPrice")),
		prop: "billingUnitPrice",
		valueType: "input",
		required: true,
	},
	// 固定费用
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.fields.fixedFee")),
		prop: "fixedFee",
		valueType: "input",
		required: true,
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	expenseItem: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.expenseItemRequired"),
			),
			trigger: "blur",
		},
	],
	expenseIdentifier: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.expenseIdentifierRequired"),
			),
			trigger: "change",
		},
	],
	paymentType: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.paymentTypeRequired"),
			),
			trigger: "change",
		},
	],
	paymentCycle: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.paymentCycleRequired"),
			),
			trigger: "blur",
		},
	],
	prepaymentPeriod: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.prepaymentPeriodRequired"),
			),
			trigger: "blur",
		},
	],
	unit: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.validation.unitRequired")),
			trigger: "blur",
		},
	],
	accountDeduction: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.accountDeductionRequired"),
			),
			trigger: "change",
		},
	],
	mobilePayment: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.mobilePaymentRequired"),
			),
			trigger: "change",
		},
	],
	roundingMode: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.roundingModeRequired"),
			),
			trigger: "change",
		},
	],
	decimalPlaces: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.decimalPlacesRequired"),
			),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.validation.statusRequired")),
			trigger: "change",
		},
	],
	formula: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.expense-item-setting.form.validation.formulaRequired")),
			trigger: "blur",
		},
	],
	billingUnitPrice: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.billingUnitPriceRequired"),
			),
			trigger: "blur",
		},
	],
	fixedFee: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-item-setting.form.validation.fixedFeeRequired"),
			),
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
