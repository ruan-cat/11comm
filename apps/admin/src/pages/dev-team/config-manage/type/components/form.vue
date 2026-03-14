<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import type { DictionaryTypeFormVO } from "@01s-11comm/type";
import {
	dictionaryTypeStatusOptions,
	dictionaryCategoryOptions,
	dataTypeOptions,
	requiredOptions,
} from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { DictionaryTypeFormProps } from "./form";

const props = defineProps<DictionaryTypeFormProps>();
const { withLocale } = useI18nConfig();

const dictionaryCategoryLabelKeyMap = {
	system: "devTeam.configManage.type.form.options.categories.system",
	business: "devTeam.configManage.type.form.options.categories.business",
	custom: "devTeam.configManage.type.form.options.categories.custom",
	thirdParty: "devTeam.configManage.type.form.options.categories.thirdParty",
} as const;

const dataTypeLabelKeyMap = {
	string: "devTeam.configManage.type.form.options.dataTypes.string",
	number: "devTeam.configManage.type.form.options.dataTypes.number",
	boolean: "devTeam.configManage.type.form.options.dataTypes.boolean",
	date: "devTeam.configManage.type.form.options.dataTypes.date",
	time: "devTeam.configManage.type.form.options.dataTypes.time",
	datetime: "devTeam.configManage.type.form.options.dataTypes.datetime",
	json: "devTeam.configManage.type.form.options.dataTypes.json",
	array: "devTeam.configManage.type.form.options.dataTypes.array",
	file: "devTeam.configManage.type.form.options.dataTypes.file",
	email: "devTeam.configManage.type.form.options.dataTypes.email",
	phone: "devTeam.configManage.type.form.options.dataTypes.phone",
	url: "devTeam.configManage.type.form.options.dataTypes.url",
} as const;

const requiredLabelKeyMap = {
	true: "devTeam.configManage.type.form.options.required.true",
	false: "devTeam.configManage.type.form.options.required.false",
} as const;

const statusLabelKeyMap = {
	enabled: "devTeam.configManage.type.options.status.enabled",
	disabled: "devTeam.configManage.type.options.status.disabled",
} as const;

const defaultValues = props.defaultValues as unknown as FieldValues & DictionaryTypeFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as unknown as FieldValues & DictionaryTypeFormVO;
const form = ref(toRefForm);
const formComputed = computed(() => form.value);

const translatedDictionaryCategoryOptions = withLocale(() =>
	dictionaryCategoryOptions.map((option) => ({
		...option,
		label: transformI18n(
			$t(dictionaryCategoryLabelKeyMap[String(option.value) as keyof typeof dictionaryCategoryLabelKeyMap]),
		),
	})),
);

const translatedDataTypeOptions = withLocale(() =>
	dataTypeOptions.map((option) => ({
		...option,
		label: transformI18n($t(dataTypeLabelKeyMap[String(option.value) as keyof typeof dataTypeLabelKeyMap])),
	})),
);

const translatedRequiredOptions = withLocale(() =>
	requiredOptions.map((option) => ({
		...option,
		label: transformI18n($t(requiredLabelKeyMap[String(option.value) as keyof typeof requiredLabelKeyMap])),
	})),
);

const translatedStatusOptions = withLocale(() =>
	dictionaryTypeStatusOptions.map((option) => ({
		...option,
		label: transformI18n($t(statusLabelKeyMap[String(option.value) as keyof typeof statusLabelKeyMap])),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.type.fields.dictionaryNumber")),
		prop: "dictionaryNumber",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.dictionaryNumber")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.dictionaryName")),
		prop: "dictionaryName",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.dictionaryName")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.dictionaryType")),
		prop: "dictionaryType",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.dictionaryType")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.dictionaryCategory")),
		prop: "dictionaryCategory",
		valueType: "select",
		width: "180px",
		required: true,
		options: translatedDictionaryCategoryOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.dictionaryCategory")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.dataType")),
		prop: "dataType",
		valueType: "select",
		width: "150px",
		required: true,
		options: translatedDataTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.dataType")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.defaultValue")),
		prop: "defaultValue",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.defaultValue")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.isRequired")),
		prop: "isRequired",
		valueType: "select",
		width: "120px",
		required: true,
		options: translatedRequiredOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.isRequired")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.validationRule")),
		prop: "validationRule",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.validationRule")),
			rows: 3,
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.displayOrder")),
		prop: "displayOrder",
		valueType: "input-number",
		width: "150px",
		required: true,
		fieldProps: {
			min: 0,
			max: 9999,
			precision: 0,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.displayOrder")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.status")),
		prop: "status",
		valueType: "select",
		width: "120px",
		required: true,
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.status")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.type.form.placeholders.remark")),
			rows: 3,
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	dictionaryNumber: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dictionaryNumberRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dictionaryNumberLength")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Za-z0-9_]+$/,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dictionaryNumberPattern")),
			trigger: "blur",
		},
	],
	dictionaryName: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dictionaryNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dictionaryNameLength")),
			trigger: "blur",
		},
	],
	dictionaryType: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dictionaryTypeRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dictionaryTypeLength")),
			trigger: "blur",
		},
		{
			pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dictionaryTypePattern")),
			trigger: "blur",
		},
	],
	dictionaryCategory: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dictionaryCategoryRequired")),
			trigger: "change",
		},
	],
	dataType: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.dataTypeRequired")),
			trigger: "change",
		},
	],
	isRequired: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.isRequiredRequired")),
			trigger: "change",
		},
	],
	displayOrder: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.displayOrderRequired")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 0,
			max: 9999,
			message: transformI18n($t("devTeam.configManage.type.form.validation.displayOrderRange")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.statusRequired")),
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
