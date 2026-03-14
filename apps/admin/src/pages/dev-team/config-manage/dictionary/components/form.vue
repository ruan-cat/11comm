<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import type { DictionaryFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { DictionaryFormProps } from "./form";
import { dictionaryTypeOptions, enableStatusOptions } from "@01s-11comm/type";
import { useI18nConfig } from "@/composables/use-i18n-config";

const props = defineProps<DictionaryFormProps>();
const { locale, withLocale } = useI18nConfig();

const dictionaryTypeLabelKeyMap = {
	system: "devTeam.configManage.dictionary.form.options.system",
	business: "devTeam.configManage.dictionary.form.options.business",
	region: "devTeam.configManage.dictionary.form.options.region",
	status: "devTeam.configManage.dictionary.form.options.status",
	config: "devTeam.configManage.dictionary.form.options.config",
} as const;

const enableStatusLabelKeyMap = {
	enabled: "devTeam.configManage.dictionary.form.options.enabled",
	disabled: "devTeam.configManage.dictionary.form.options.disabled",
} as const;

const defaultValues = props.defaultValues as FieldValues & DictionaryFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & DictionaryFormVO;
const form = ref(toRefForm);

const formComputed = computed(() => {
	return form.value;
});

const translatedDictionaryTypeOptions = withLocale(() =>
	dictionaryTypeOptions.map((option) => ({
		...option,
		label: transformI18n($t(dictionaryTypeLabelKeyMap[String(option.value) as keyof typeof dictionaryTypeLabelKeyMap])),
	})),
);

const translatedEnableStatusOptions = withLocale(() =>
	enableStatusOptions.map((option) => ({
		...option,
		label: transformI18n($t(enableStatusLabelKeyMap[String(option.value) as keyof typeof enableStatusLabelKeyMap])),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryName")),
		prop: "dictionaryName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryCode")),
		prop: "dictionaryCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryType")),
		prop: "dictionaryType",
		valueType: "select",
		options: translatedDictionaryTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.description")),
		prop: "dictionaryDescription",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.isEnabled")),
		prop: "isEnabled",
		valueType: "select",
		options: translatedEnableStatusOptions.value,
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.remark")),
		prop: "remark",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	dictionaryName: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.enterDictionaryName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.dictionaryNameLength")),
			trigger: "blur",
		},
	],
	dictionaryCode: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.enterDictionaryCode")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.dictionaryCodeLength")),
			trigger: "blur",
		},
		{
			pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.dictionaryCodePattern")),
			trigger: "blur",
		},
	],
	dictionaryType: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.selectDictionaryType")),
			trigger: "change",
		},
	],
	isEnabled: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.selectIsEnabled")),
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
