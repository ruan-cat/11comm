<!--
  商户信息表单
  用于新增 修改商户信息
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import type { PlusColumn } from "plus-pro-components";
import { businessStatusOptions, merchantTypeOptions, type MerchantInfoFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { MerchantInfoFormProps } from "./form";

const props = defineProps<MerchantInfoFormProps>();
const { locale, withLocale } = useI18nConfig();


const defaultValues = props.defaultValues as FieldValues & MerchantInfoFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & MerchantInfoFormVO);
const formComputed = computed(() => form.value);

const merchantTypeLabelKeyMap = {
	餐饮服务: $t("operation-team_merchant-manage.merchant-info.options.merchantType.cateringService"),
	零售商店: $t("operation-team_merchant-manage.merchant-info.options.merchantType.retailStore"),
	生活服务: $t("operation-team_merchant-manage.merchant-info.options.merchantType.lifeService"),
	休闲娱乐: $t("operation-team_merchant-manage.merchant-info.options.merchantType.leisureEntertainment"),
	教育培训: $t("operation-team_merchant-manage.merchant-info.options.merchantType.educationTraining"),
	医疗健康: $t("operation-team_merchant-manage.merchant-info.options.merchantType.medicalHealth"),
	其他: $t("operation-team_merchant-manage.merchant-info.options.merchantType.other"),
	cateringService: $t("operation-team_merchant-manage.merchant-info.options.merchantType.cateringService"),
	retailStore: $t("operation-team_merchant-manage.merchant-info.options.merchantType.retailStore"),
	lifeService: $t("operation-team_merchant-manage.merchant-info.options.merchantType.lifeService"),
	leisureEntertainment: $t("operation-team_merchant-manage.merchant-info.options.merchantType.leisureEntertainment"),
	educationTraining: $t("operation-team_merchant-manage.merchant-info.options.merchantType.educationTraining"),
	medicalHealth: $t("operation-team_merchant-manage.merchant-info.options.merchantType.medicalHealth"),
	other: $t("operation-team_merchant-manage.merchant-info.options.merchantType.other"),
} as const;

const businessStatusLabelKeyMap = {
	正常营业: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.normalOperation"),
	暂停营业: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.suspendedOperation"),
	准备开业: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.preparingToOpen"),
	已停业: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.closed"),
	normalOperation: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.normalOperation"),
	suspendedOperation: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.suspendedOperation"),
	preparingToOpen: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.preparingToOpen"),
	closed: $t("operation-team_merchant-manage.merchant-info.options.businessStatus.closed"),
} as const;

function translateMerchantType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = merchantTypeLabelKeyMap[value as keyof typeof merchantTypeLabelKeyMap];
	return key ? transformI18n(key) : value;
}

function translateBusinessStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = businessStatusLabelKeyMap[value as keyof typeof businessStatusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const translatedMerchantTypeOptions = withLocale(() =>
	merchantTypeOptions.map((option) => ({
		...option,
		label: translateMerchantType(String(option.value)),
	})),
);

const translatedBusinessStatusOptions = withLocale(() =>
	businessStatusOptions.map((option) => ({
		...option,
		label: translateBusinessStatus(String(option.value)),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantId")),
		prop: "merchantId",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.merchantId")),
			disabled: true,
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantName")),
		prop: "merchantName",
		valueType: "input",
		width: "240px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.merchantName")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantType")),
		prop: "merchantType",
		valueType: "select",
		width: "160px",
		options: translatedMerchantTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.merchantType")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.businessStatus")),
		prop: "businessStatus",
		valueType: "select",
		width: "140px",
		options: translatedBusinessStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.businessStatus")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.merchantAddress")),
		prop: "merchantAddress",
		valueType: "input",
		width: "320px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.merchantAddress")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.affiliatedCommunity")),
		prop: "affiliatedCommunity",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.affiliatedCommunity")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.contactPhone")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.contactMobile")),
		prop: "contactMobile",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.contactMobile")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.legalRepresentative")),
		prop: "legalRepresentative",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.legalRepresentative")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.establishmentDate")),
		prop: "establishmentDate",
		valueType: "date-picker",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.establishmentDate")),
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.businessHours")),
		prop: "businessHours",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.businessHours")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.businessArea")),
		prop: "businessArea",
		valueType: "input-number",
		width: "160px",
		fieldProps: {
			min: 0,
			max: 999999,
			precision: 2,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.businessArea")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.businessLicenseNo")),
		prop: "businessLicenseNo",
		valueType: "input",
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.businessLicenseNo")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.bankName")),
		prop: "bankName",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.bankName")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.bankAccount")),
		prop: "bankAccount",
		valueType: "input",
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.bankAccount")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-info.fields.remarks")),
		prop: "remarks",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-info.form.placeholders.remarks")),
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	merchantName: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.enterMerchantName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.merchantNameLength")),
			trigger: "blur",
		},
	],
	merchantType: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.selectMerchantType")),
			trigger: "change",
		},
	],
	businessStatus: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.selectBusinessStatus")),
			trigger: "change",
		},
	],
	merchantAddress: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.enterMerchantAddress")),
			trigger: "blur",
		},
		{
			min: 5,
			max: 200,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.merchantAddressLength")),
			trigger: "blur",
		},
	],
	affiliatedCommunity: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.enterAffiliatedCommunity")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.affiliatedCommunityLength")),
			trigger: "blur",
		},
	],
	contactPhone: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.enterContactPhone")),
			trigger: "blur",
		},
		{
			pattern: /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.contactPhonePattern")),
			trigger: "blur",
		},
	],
	contactMobile: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.enterContactMobile")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.contactMobilePattern")),
			trigger: "blur",
		},
	],
	legalRepresentative: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.enterLegalRepresentative")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 10,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.legalRepresentativeLength")),
			trigger: "blur",
		},
	],
	establishmentDate: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.selectEstablishmentDate")),
			trigger: "change",
		},
	],
	businessHours: [
		{
			pattern: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])-([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.businessHoursPattern")),
			trigger: "blur",
		},
	],
	businessArea: [
		{
			type: "number",
			min: 0,
			max: 999999,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.businessAreaRange")),
			trigger: "blur",
		},
	],
	businessLicenseNo: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.enterBusinessLicenseNo")),
			trigger: "blur",
		},
		{
			pattern: /^[0-9A-Z]{18}$/,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.businessLicenseNoPattern")),
			trigger: "blur",
		},
	],
	bankName: [
		{
			max: 50,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.bankNameMax")),
			trigger: "blur",
		},
	],
	bankAccount: [
		{
			max: 30,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.bankAccountMax")),
			trigger: "blur",
		},
	],
	remarks: [
		{
			max: 500,
			message: transformI18n($t("operation-team_merchant-manage.merchant-info.form.validation.remarksMax")),
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
			:label-width="120"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
