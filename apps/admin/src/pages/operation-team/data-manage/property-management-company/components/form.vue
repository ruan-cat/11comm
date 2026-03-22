<!--
  物业公司表单
  用于新增/修改物业公司信息
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { PropertyManagementCompanyFormVO } from "@01s-11comm/type";
import { type PropertyManagementCompanyFormProps } from "./form";

const props = defineProps<PropertyManagementCompanyFormProps>();

const defaultValues = props.defaultValues as FieldValues & PropertyManagementCompanyFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & PropertyManagementCompanyFormVO);
const formComputed = computed(() => form.value);

const translatedCompanyTypeOptions = computed(() => [
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.options.companyTypes.stateOwned")),
		value: "state_owned",
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.options.companyTypes.private")),
		value: "private",
	},
]);

const translatedServiceLevelOptions = computed(() => [
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.options.serviceLevels.level1")),
		value: "level_1",
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.options.serviceLevels.level2")),
		value: "level_2",
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.options.serviceLevels.level3")),
		value: "level_3",
	},
]);

const translatedOperationStatusOptions = computed(() => [
	{
		label: transformI18n(
			$t("operation-team_data-manage.property-management-company.options.operationStatuses.operating"),
		),
		value: "operating",
	},
	{
		label: transformI18n(
			$t("operation-team_data-manage.property-management-company.options.operationStatuses.suspended"),
		),
		value: "suspended",
	},
	{
		label: transformI18n(
			$t("operation-team_data-manage.property-management-company.options.operationStatuses.cancelled"),
		),
		value: "cancelled",
	},
]);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.companyName")),
		prop: "name",
		valueType: "input",
		width: "240px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_data-manage.property-management-company.placeholders.companyName")),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.address")),
		prop: "address",
		valueType: "input",
		width: "320px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_data-manage.property-management-company.placeholders.address")),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.phone")),
		prop: "phone",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_data-manage.property-management-company.placeholders.phone")),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.administrator")),
		prop: "administrator",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("operation-team_data-manage.property-management-company.placeholders.administrator"),
			),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.legalRepresentative")),
		prop: "legalRepresentative",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("operation-team_data-manage.property-management-company.placeholders.legalRepresentative"),
			),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.establishmentDate")),
		prop: "establishmentDate",
		valueType: "date-picker",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("operation-team_data-manage.property-management-company.placeholders.establishmentDate"),
			),
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.landmark")),
		prop: "landmark",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_data-manage.property-management-company.placeholders.landmark")),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.communityCount")),
		prop: "communityCount",
		valueType: "input-number",
		width: "160px",
		fieldProps: {
			min: 0,
			max: 9999,
			precision: 0,
			placeholder: transformI18n(
				$t("operation-team_data-manage.property-management-company.placeholders.communityCount"),
			),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.companyType")),
		prop: "companyType",
		valueType: "select",
		width: "160px",
		options: translatedCompanyTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("operation-team_data-manage.property-management-company.placeholders.companyType")),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.serviceLevel")),
		prop: "serviceLevel",
		valueType: "select",
		width: "140px",
		options: translatedServiceLevelOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("operation-team_data-manage.property-management-company.placeholders.serviceLevel"),
			),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.operationStatus")),
		prop: "operationStatus",
		valueType: "select",
		width: "140px",
		options: translatedOperationStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("operation-team_data-manage.property-management-company.placeholders.operationStatus"),
			),
		},
	},
	{
		label: transformI18n($t("operation-team_data-manage.property-management-company.fields.remarks")),
		prop: "remarks",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_data-manage.property-management-company.placeholders.remarks")),
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.companyNameRequired"),
			),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("operation-team_data-manage.property-management-company.validation.companyNameLength")),
			trigger: "blur",
		},
	],
	address: [
		{
			required: true,
			message: transformI18n($t("operation-team_data-manage.property-management-company.validation.addressRequired")),
			trigger: "blur",
		},
		{
			min: 5,
			max: 200,
			message: transformI18n($t("operation-team_data-manage.property-management-company.validation.addressLength")),
			trigger: "blur",
		},
	],
	phone: [
		{
			required: true,
			message: transformI18n($t("operation-team_data-manage.property-management-company.validation.phoneRequired")),
			trigger: "blur",
		},
		{
			pattern: /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/,
			message: transformI18n($t("operation-team_data-manage.property-management-company.validation.phoneInvalid")),
			trigger: "blur",
		},
	],
	administrator: [
		{
			required: true,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.administratorRequired"),
			),
			trigger: "blur",
		},
		{
			min: 2,
			max: 10,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.administratorLength"),
			),
			trigger: "blur",
		},
	],
	legalRepresentative: [
		{
			required: true,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.legalRepresentativeRequired"),
			),
			trigger: "blur",
		},
		{
			min: 2,
			max: 10,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.legalRepresentativeLength"),
			),
			trigger: "blur",
		},
	],
	establishmentDate: [
		{
			required: true,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.establishmentDateRequired"),
			),
			trigger: "change",
		},
	],
	landmark: [
		{
			max: 50,
			message: transformI18n($t("operation-team_data-manage.property-management-company.validation.landmarkLength")),
			trigger: "blur",
		},
	],
	communityCount: [
		{
			required: true,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.communityCountRequired"),
			),
			trigger: "blur",
		},
		{
			type: "number",
			min: 0,
			max: 9999,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.communityCountRange"),
			),
			trigger: "blur",
		},
	],
	companyType: [
		{
			required: true,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.companyTypeRequired"),
			),
			trigger: "change",
		},
	],
	serviceLevel: [
		{
			required: true,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.serviceLevelRequired"),
			),
			trigger: "change",
		},
	],
	operationStatus: [
		{
			required: true,
			message: transformI18n(
				$t("operation-team_data-manage.property-management-company.validation.operationStatusRequired"),
			),
			trigger: "change",
		},
	],
	remarks: [
		{
			max: 500,
			message: transformI18n($t("operation-team_data-manage.property-management-company.validation.remarksLength")),
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
