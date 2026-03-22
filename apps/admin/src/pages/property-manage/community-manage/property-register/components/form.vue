<!--
  产权登记表单
  用于新增/修改产权登记
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import type { PropertyRegisterFormVO } from "@01s-11comm/type";
import type { PropertyRegisterFormProps } from "./form";

const props = defineProps<PropertyRegisterFormProps>();

const defaultValues = props.defaultValues as FieldValues & PropertyRegisterFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & PropertyRegisterFormVO);
const formComputed = computed(() => form.value);

const statusLabelKeyMap = {
	启用: "propertyManage_communityManage.property-register.options.status.enabled",
	禁用: "propertyManage_communityManage.property-register.options.status.disabled",
	enabled: "propertyManage_communityManage.property-register.options.status.enabled",
	disabled: "propertyManage_communityManage.property-register.options.status.disabled",
} as const;

const statusOptions = computed(() =>
	(["enabled", "disabled"] as const).map((value) => ({
		label: transformI18n($t(statusLabelKeyMap[value])),
		value,
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.propertyRightId")),
		prop: "propertyRightId",
		valueType: "input",
		fieldProps: {
			disabled: true,
			placeholder: transformI18n(
				$t("propertyManage_communityManage.property-register.form.placeholders.propertyRightId"),
			),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.houseId")),
		prop: "houseId",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.houseId")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.houseNumber")),
		prop: "houseNumber",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.houseNumber")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.ownerName")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.contactInfo")),
		prop: "contactInfo",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.contactInfo")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.idCardNumber")),
		prop: "idCardNumber",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.idCardNumber")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.address")),
		prop: "address",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.address")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.status")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.property-register.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
			placeholder: transformI18n($t("propertyManage_communityManage.property-register.form.placeholders.remark")),
			disabled: props.mode === "info",
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	houseId: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.property-register.form.validation.enterHouseId")),
			trigger: "blur",
		},
	],
	houseNumber: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.property-register.form.validation.enterHouseNumber")),
			trigger: "blur",
		},
	],
	ownerName: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.property-register.form.validation.enterOwnerName")),
			trigger: "blur",
		},
	],
	contactInfo: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.property-register.form.validation.enterContactInfo")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("propertyManage_communityManage.property-register.form.validation.contactInfoPattern")),
			trigger: "blur",
		},
	],
	idCardNumber: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.property-register.form.validation.enterIdCardNumber")),
			trigger: "blur",
		},
		{
			pattern: /^\d{17}[\dXx]$/,
			message: transformI18n(
				$t("propertyManage_communityManage.property-register.form.validation.idCardNumberPattern"),
			),
			trigger: "blur",
		},
	],
	address: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.property-register.form.validation.enterAddress")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.property-register.form.validation.selectStatus")),
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
