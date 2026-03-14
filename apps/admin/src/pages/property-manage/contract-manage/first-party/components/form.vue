<!--
  合同甲方表单
  用于新增、修改合同甲方
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { FirstPartyFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { PlusFormRules } from "@/config/constant";

import { type FirstPartyFormProps, defaultForm } from "./form";

const props = defineProps<FirstPartyFormProps>();
const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & FirstPartyFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & FirstPartyFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.partyA")),
		prop: "partyA",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.first-party.form.placeholders.partyA")),
		},
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.contactPerson")),
		prop: "contactPerson",
		valueType: "input",
		required: true,
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.first-party.form.placeholders.contactPerson")),
		},
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		required: true,
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.first-party.form.placeholders.contactPhone")),
		},
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.address")),
		prop: "address",
		valueType: "input",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.first-party.form.placeholders.address")),
		},
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.creditCode")),
		prop: "creditCode",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.first-party.form.placeholders.creditCode")),
		},
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.establishmentDate")),
		prop: "establishmentDate",
		valueType: "date-picker",
		required: true,
		width: "180px",
		fieldProps: {
			clearable: true,
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			placeholder: transformI18n($t("property-manage_contract-manage.first-party.form.placeholders.establishmentDate")),
		},
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.legalRepresentative")),
		prop: "legalRepresentative",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.first-party.form.placeholders.legalRepresentative"),
			),
		},
	},

	{
		label: transformI18n($t("property-manage_contract-manage.first-party.fields.businessScope")),
		prop: "businessScope",
		valueType: "textarea",
		width: "400px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.first-party.form.placeholders.businessScope")),
			rows: 4,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	partyA: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.first-party.form.validation.partyARequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: transformI18n($t("property-manage_contract-manage.first-party.form.validation.partyALength")),
			trigger: "blur",
		},
	],
	contactPerson: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.first-party.form.validation.contactPersonRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_contract-manage.first-party.form.validation.contactPersonLength")),
			trigger: "blur",
		},
	],
	contactPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.first-party.form.validation.contactPhoneRequired")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.first-party.form.validation.contactPhoneFormat")),
			trigger: "blur",
		},
	],
	address: [
		{
			min: 5,
			max: 200,
			message: transformI18n($t("property-manage_contract-manage.first-party.form.validation.addressLength")),
			trigger: "blur",
		},
	],
	creditCode: [
		{
			pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
			message: transformI18n($t("property-manage_contract-manage.first-party.form.validation.creditCodeFormat")),
			trigger: "blur",
		},
	],
	establishmentDate: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_contract-manage.first-party.form.validation.establishmentDateRequired"),
			),
			trigger: "change",
		},
	],
	legalRepresentative: [
		{
			min: 2,
			max: 50,
			message: transformI18n(
				$t("property-manage_contract-manage.first-party.form.validation.legalRepresentativeLength"),
			),
			trigger: "blur",
		},
	],
	businessScope: [
		{
			min: 5,
			max: 500,
			message: transformI18n($t("property-manage_contract-manage.first-party.form.validation.businessScopeLength")),
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
	<section class="form-root">
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
