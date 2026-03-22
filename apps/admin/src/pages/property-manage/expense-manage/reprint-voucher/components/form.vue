<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { ReprintVoucherFormVO } from "@01s-11comm/type";
import { feeTypeOptions } from "@01s-11comm/type";

import { ReprintVoucherFormProps, defaultForm } from "./form";

const props = defineProps<ReprintVoucherFormProps>();

const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ReprintVoucherFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & ReprintVoucherFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.receiptNumber")),
		prop: "receiptNumber",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.feeType")),
		prop: "feeType",
		valueType: "select",
		options: feeTypeOptions,
		fieldProps: {
			disabled: true,
			clearable: true,
			filterable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.feeItem")),
		prop: "feeItem",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.house")),
		prop: "house",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.owner")),
		prop: "owner",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.parkingSpace")),
		prop: "parkingSpace",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.totalAmount")),
		prop: "totalAmount",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.paymentTime")),
		prop: "paymentTime",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.printCopies")),
		prop: "printCopies",
		valueType: "input-number",
		fieldProps: {
			min: 1,
			max: 10,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.fields.printRemark")),
		prop: "printRemark",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			clearable: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	printCopies: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.validation.printCopiesRequired")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			max: 10,
			message: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.validation.printCopiesRange")),
			trigger: "blur",
		},
	],
	printRemark: [
		{
			max: 200,
			message: transformI18n($t("property-manage_expense-manage.reprint-voucher.form.validation.printRemarkLength")),
			trigger: "blur",
		},
	],
}));

// 对外导出
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
