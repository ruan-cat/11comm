<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import type { InvoiceFormVO } from "@01s-11comm/type";
import { invoiceTypeOptions, invoiceAuditStatusOptions } from "@01s-11comm/type";
import { InvoiceFormProps } from "./form";
import type { FieldValues } from "plus-pro-components";

/** 表单组件的 props */
const props = defineProps<InvoiceFormProps>();

const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & InvoiceFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

/** 表单重设 */
usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const form = ref(cloneDeep(props.form) as FieldValues & InvoiceFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.code")),
		prop: "code",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.invoiceType")),
		prop: "invoiceType",
		valueType: "select",
		options: invoiceTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.applicant")),
		prop: "applicant",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.invoiceTitle")),
		prop: "invoiceTitle",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.taxpayerId")),
		prop: "taxpayerId",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.applicationAmount")),
		prop: "applicationAmount",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.invoiceNumber")),
		prop: "invoiceNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.auditStatus")),
		prop: "auditStatus",
		valueType: "select",
		options: invoiceAuditStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.invoice.form.fields.applicationTime")),
		prop: "applicationTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	invoiceType: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice.form.validation.invoiceTypeRequired")),
			trigger: "change",
		},
	],
	ownerName: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice.form.validation.ownerNameRequired")),
			trigger: "blur",
		},
	],
	applicant: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice.form.validation.applicantRequired")),
			trigger: "blur",
		},
	],
	invoiceTitle: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice.form.validation.invoiceTitleRequired")),
			trigger: "blur",
		},
	],
	taxpayerId: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice.form.validation.taxpayerIdRequired")),
			trigger: "blur",
		},
	],
	applicationAmount: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.invoice.form.validation.applicationAmountRequired"),
			),
			trigger: "blur",
		},
	],
	invoiceNumber: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.invoice.form.validation.invoiceNumberRequired")),
			trigger: "blur",
		},
	],
}));

/** 对外导出表单实例和表单对象 */
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
