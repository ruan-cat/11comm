<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { WaterAndElectricityMeterReadingFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { WaterAndElectricityMeterReadingFormProps } from "./form";

const props = defineProps<WaterAndElectricityMeterReadingFormProps>();

const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & WaterAndElectricityMeterReadingFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & WaterAndElectricityMeterReadingFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedExpenseTypeOptions = computed(() => [
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.options.expenseType.waterFee"),
		),
		value: "水费",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.options.expenseType.electricityFee"),
		),
		value: "电费",
	},
]);

const translatedChargeItemOptions = computed(() => [
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.options.chargeItem.waterMeter"),
		),
		value: "水表",
	},
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.options.chargeItem.electricityMeter"),
		),
		value: "电表",
	},
]);

const translatedMeterReadingTypeOptions = computed(() => [
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.options.meterReadingType.waterMeter"),
		),
		value: "水表",
	},
	{
		label: transformI18n(
			$t(
				"property-manage_expense-manage.water-and-electricity-meter-reading.form.options.meterReadingType.electricityMeter",
			),
		),
		value: "电表",
	},
]);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 费用类型
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.fields.expenseType"),
		),
		prop: "expenseType",
		valueType: "select",
		options: translatedExpenseTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		width: "200px",
	},
	// 收费项目
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.fields.chargeItem"),
		),
		prop: "chargeItem",
		valueType: "select",
		options: translatedChargeItemOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		width: "200px",
	},
	// 抄表类型
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.fields.meterReadingType"),
		),
		prop: "meterReadingType",
		valueType: "select",
		options: translatedMeterReadingTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		width: "200px",
	},
	// 收费对象
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.fields.chargeObject"),
		),
		prop: "chargeObject",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.placeholders.chargeObject"),
			),
		},
		width: "200px",
	},
	// 上期度数
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.fields.lastReading"),
		),
		prop: "lastReading",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.placeholders.lastReading"),
			),
		},
		width: "200px",
	},
	// 本期度数
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.fields.currentReading"),
		),
		prop: "currentReading",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.placeholders.currentReading"),
			),
		},
		width: "200px",
	},
	// 上期读表时间
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.fields.lastReadingTime"),
		),
		prop: "lastReadingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
		width: "220px",
	},
	// 本期读表时间
	{
		label: transformI18n(
			$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.fields.currentReadingTime"),
		),
		prop: "currentReadingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
		width: "220px",
	},
	// 备注
	{
		label: transformI18n($t("property-manage_expense-manage.water-and-electricity-meter-reading.form.fields.remark")),
		prop: "remark",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.placeholders.remark"),
			),
		},
		width: "300px",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	expenseType: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.expenseTypeRequired"),
			),
			trigger: "change",
		},
	],
	chargeItem: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.chargeItemRequired"),
			),
			trigger: "change",
		},
	],
	meterReadingType: [
		{
			required: true,
			message: transformI18n(
				$t(
					"property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.meterReadingTypeRequired",
				),
			),
			trigger: "change",
		},
	],
	chargeObject: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.chargeObjectRequired"),
			),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.chargeObjectLength"),
			),
			trigger: "blur",
		} as any,
	],
	lastReading: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.lastReadingRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^\d+$/,
			message: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.lastReadingFormat"),
			),
			trigger: "blur",
		} as any,
	],
	currentReading: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.currentReadingRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^\d+$/,
			message: transformI18n(
				$t("property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.currentReadingFormat"),
			),
			trigger: "blur",
		} as any,
	],
	lastReadingTime: [
		{
			required: true,
			message: transformI18n(
				$t(
					"property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.lastReadingTimeRequired",
				),
			),
			trigger: "change",
		},
	],
	currentReadingTime: [
		{
			required: true,
			message: transformI18n(
				$t(
					"property-manage_expense-manage.water-and-electricity-meter-reading.form.validation.currentReadingTimeRequired",
				),
			),
			trigger: "change",
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
