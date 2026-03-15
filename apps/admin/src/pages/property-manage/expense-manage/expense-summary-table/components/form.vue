<!--
  费用汇总表表单
  用于新增或修改费用汇总表数据
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { ExpenseSummaryTableFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { ExpenseSummaryTableFormProps, defaultForm } from "./form";

const props = defineProps<ExpenseSummaryTableFormProps>();

const { locale, computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ExpenseSummaryTableFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & ExpenseSummaryTableFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedExpenseItemNameOptions = computed(() => [
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.propertyFee"),
		),
		value: "物业费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.waterFee"),
		),
		value: "水费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.electricityFee"),
		),
		value: "电费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.gasFee"),
		),
		value: "燃气费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.parkingFee"),
		),
		value: "停车费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.elevatorFee"),
		),
		value: "电梯费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.garbageFee"),
		),
		value: "垃圾处理费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.greeningFee"),
		),
		value: "绿化费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.securityFee"),
		),
		value: "安防费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.expense-summary-table.form.options.expenseItemName.maintenanceFund"),
		),
		value: "维修基金",
	},
]);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 时间
	{
		label: transformI18n($t("property-manage_expense-manage.expense-summary-table.form.fields.time")),
		prop: "time",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.expense-summary-table.form.placeholders.time")),
		},
	},

	// 费用项ID
	{
		label: transformI18n($t("property-manage_expense-manage.expense-summary-table.form.fields.expenseItemId")),
		prop: "expenseItemId",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.placeholders.expenseItemId"),
			),
		},
	},

	// 费用项名称
	{
		label: transformI18n($t("property-manage_expense-manage.expense-summary-table.form.fields.expenseItemName")),
		prop: "expenseItemName",
		valueType: "select",
		options: translatedExpenseItemNameOptions.value,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.placeholders.expenseItemName"),
			),
		},
	},

	// 应收金额
	{
		label: transformI18n($t("property-manage_expense-manage.expense-summary-table.form.fields.receivableAmount")),
		prop: "receivableAmount",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.placeholders.receivableAmount"),
			),
		},
	},

	// 实收金额
	{
		label: transformI18n($t("property-manage_expense-manage.expense-summary-table.form.fields.actualAmount")),
		prop: "actualAmount",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.placeholders.actualAmount"),
			),
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	time: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.expense-summary-table.form.validation.timeRequired")),
			trigger: "blur",
		},
	],
	expenseItemId: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.validation.expenseItemIdRequired"),
			),
			trigger: "blur",
		},
	],
	expenseItemName: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.validation.expenseItemNameRequired"),
			),
			trigger: "change",
		},
	],
	receivableAmount: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.validation.receivableAmountRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^\d+(\.\d{1,2})?$/,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.validation.receivableAmountFormat"),
			),
			trigger: "blur",
		},
	],
	actualAmount: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.validation.actualAmountRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^\d+(\.\d{1,2})?$/,
			message: transformI18n(
				$t("property-manage_expense-manage.expense-summary-table.form.validation.actualAmountFormat"),
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
