<!--
  房屋装修表单
  用于新增/修改房屋装修信息
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import type { HouseDecorationFormVO } from "@01s-11comm/type";
import { type HouseDecorationFormProps } from "./form";

const props = defineProps<HouseDecorationFormProps>();

const defaultValues = props.defaultValues as FieldValues & HouseDecorationFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & HouseDecorationFormVO);
const formComputed = computed(() => form.value);

const statusLabelKeyMap = {
	待审核: "propertyManage_communityManage.house-decoration.options.status.pending",
	审核不通过: "propertyManage_communityManage.house-decoration.options.status.rejected",
	装修中: "propertyManage_communityManage.house-decoration.options.status.inProgress",
	待验收: "propertyManage_communityManage.house-decoration.options.status.pendingAcceptance",
	验收成功: "propertyManage_communityManage.house-decoration.options.status.accepted",
	验收失败: "propertyManage_communityManage.house-decoration.options.status.failed",
} as const;

const booleanLabelKeyMap = {
	是: "propertyManage_communityManage.house-decoration.options.boolean.yes",
	否: "propertyManage_communityManage.house-decoration.options.boolean.no",
} as const;

const translatedStatusOptions = computed(() =>
	Object.entries(statusLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const translatedBooleanOptions = computed(() =>
	Object.entries(booleanLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.houseNumber")),
		prop: "houseNumber",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.houseNumber")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.contactName")),
		prop: "contactName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.contactName")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.contactPhone")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.applicationTime")),
		prop: "applicationTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n(
				$t("propertyManage_communityManage.house-decoration.form.placeholders.applicationTime"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.decorationTime")),
		prop: "decorationTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n(
				$t("propertyManage_communityManage.house-decoration.form.placeholders.decorationTime"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.decorationCompany")),
		prop: "decorationCompany",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("propertyManage_communityManage.house-decoration.form.placeholders.decorationCompany"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.managerPhone")),
		prop: "managerPhone",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.managerPhone")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.status")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.isDelayed")),
		prop: "isDelayed",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.isDelayed")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.delayTime")),
		prop: "delayTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.delayTime")),
			disabled: props.mode === "info",
		},
		hidden: (currentForm: HouseDecorationFormVO) => currentForm.isDelayed === "否",
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.isViolated")),
		prop: "isViolated",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.isViolated")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.violationDescription")),
		prop: "violationDescription",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
			placeholder: transformI18n(
				$t("propertyManage_communityManage.house-decoration.form.placeholders.violationDescription"),
			),
			disabled: props.mode === "info",
		},
		hidden: (currentForm: HouseDecorationFormVO) => currentForm.isViolated === "否",
	},
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.fields.remarks")),
		prop: "remarks",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
			placeholder: transformI18n($t("propertyManage_communityManage.house-decoration.form.placeholders.remarks")),
			disabled: props.mode === "info",
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	houseNumber: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.enterHouseNumber")),
			trigger: "blur",
		},
	],
	contactName: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.enterContactName")),
			trigger: "blur",
		},
	],
	contactPhone: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.enterContactPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.contactPhonePattern")),
			trigger: "blur",
		},
	],
	applicationTime: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_communityManage.house-decoration.form.validation.selectApplicationTime"),
			),
			trigger: "change",
		},
	],
	decorationTime: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_communityManage.house-decoration.form.validation.selectDecorationTime"),
			),
			trigger: "change",
		},
	],
	decorationCompany: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_communityManage.house-decoration.form.validation.enterDecorationCompany"),
			),
			trigger: "blur",
		},
	],
	managerPhone: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.enterManagerPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.managerPhonePattern")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.selectStatus")),
			trigger: "change",
		},
	],
	isDelayed: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.selectIsDelayed")),
			trigger: "change",
		},
	],
	delayTime: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.selectDelayTime")),
			trigger: "change",
		},
	],
	isViolated: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.selectIsViolated")),
			trigger: "change",
		},
	],
	violationDescription: [
		{
			max: 500,
			message: transformI18n(
				$t("propertyManage_communityManage.house-decoration.form.validation.violationDescriptionMaxLength"),
			),
			trigger: "blur",
		},
	],
	remarks: [
		{
			max: 500,
			message: transformI18n($t("propertyManage_communityManage.house-decoration.form.validation.remarksMaxLength")),
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
