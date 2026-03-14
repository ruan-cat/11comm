<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { invoiceTypeOptions } from "@01s-11comm/type";
import { type InvoiceTitleFormProps } from "./form";
import type { InvoiceTitleFormVO } from "@01s-11comm/type";

const { locale, withLocale } = useI18nConfig();

/** 表单组件props */
const props = defineProps<InvoiceTitleFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & InvoiceTitleFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & InvoiceTitleFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice-title.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_house-property-manage.invoice-title.form.placeholders.ownerName")),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice-title.fields.invoiceType")),
		prop: "invoiceType",
		valueType: "select",
		options: invoiceTypeOptions,
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.invoice-title.form.placeholders.invoiceType"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice-title.fields.invoiceTitle")),
		prop: "invoiceTitle",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.invoice-title.form.placeholders.invoiceTitle"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice-title.fields.taxpayerId")),
		prop: "taxpayerId",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.invoice-title.form.placeholders.taxpayerId"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice-title.fields.address")),
		prop: "address",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_house-property-manage.invoice-title.form.placeholders.address")),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice-title.fields.phone")),
		prop: "phone",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_house-property-manage.invoice-title.form.placeholders.phone")),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice-title.fields.bankAccount")),
		prop: "bankAccount",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.invoice-title.form.placeholders.bankAccount"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice-title.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_house-property-manage.invoice-title.form.placeholders.remark")),
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	ownerName: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice-title.form.rules.ownerNameRequired")),
			trigger: "blur",
		},
	],
	invoiceType: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice-title.form.rules.invoiceTypeRequired")),
			trigger: "change",
		},
	],
	invoiceTitle: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice-title.form.rules.invoiceTitleRequired")),
			trigger: "blur",
		},
	],
	taxpayerId: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice-title.form.rules.taxpayerIdRequired")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Z0-9]{15,20}$/,
			message: transformI18n($t("property-manage_house-property-manage.invoice-title.form.rules.taxpayerIdFormat")),
			trigger: "blur",
		},
	],
}));

// 默认导出表单实例和计算属性
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
