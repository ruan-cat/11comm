<!--
  车辆收费表单
  用于新增 修改车辆收费
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import type { VehicleChargeFormVO } from "@01s-11comm/type";
import { parkingSpaceStatusOptions } from "@01s-11comm/type";
import type { FieldValues } from "plus-pro-components";

import { VehicleChargeFormProps, defaultForm } from "./form";

const props = defineProps<VehicleChargeFormProps>();

const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & VehicleChargeFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & VehicleChargeFormVO;

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
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.fields.licensePlateNumber")),
		prop: "licensePlateNumber",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.vehicle-charge.form.placeholders.licensePlateNumber"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.placeholders.ownerName")),
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.fields.parkingSpaceStatus")),
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.vehicle-charge.form.placeholders.parkingSpaceStatus"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.fields.chargeAmount")),
		prop: "chargeAmount",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.placeholders.chargeAmount")),
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.fields.chargeTime")),
		prop: "chargeTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.placeholders.chargeTime")),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.fields.chargeMethod")),
		prop: "chargeMethod",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.placeholders.chargeMethod")),
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	licensePlateNumber: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.vehicle-charge.form.validation.licensePlateNumberRequired"),
			),
			trigger: "blur",
		},
	],
	ownerName: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.validation.ownerNameRequired")),
			trigger: "blur",
		},
	],
	parkingSpaceStatus: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.vehicle-charge.form.validation.parkingSpaceStatusRequired"),
			),
			trigger: "change",
		},
	],
	chargeAmount: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.validation.chargeAmountRequired")),
			trigger: "blur",
		},
	],
	chargeTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.validation.chargeTimeRequired")),
			trigger: "change",
		},
	],
	chargeMethod: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.vehicle-charge.form.validation.chargeMethodRequired")),
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
