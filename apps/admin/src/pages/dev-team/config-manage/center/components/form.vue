<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { configStatusOptions, configTypeOptions, type ConfigCenterFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type ConfigCenterFormProps } from "./form";

const props = defineProps<ConfigCenterFormProps>();
const { locale, computed } = useI18nConfig();

const configTypeLabelKeyMap = {
	system: $t("devTeam.configManage.center.form.options.system"),
	business: $t("devTeam.configManage.center.form.options.business"),
	api: $t("devTeam.configManage.center.form.options.api"),
	database: $t("devTeam.configManage.center.form.options.database"),
	cache: $t("devTeam.configManage.center.form.options.cache"),
	security: $t("devTeam.configManage.center.form.options.security"),
	email: $t("devTeam.configManage.center.form.options.email"),
	file: $t("devTeam.configManage.center.form.options.file"),
} as const;

const statusLabelKeyMap = {
	enabled: $t("devTeam.configManage.center.form.options.enabled"),
	disabled: $t("devTeam.configManage.center.form.options.disabled"),
} as const;

function translateConfigType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = configTypeLabelKeyMap[value as keyof typeof configTypeLabelKeyMap];
	return key ? transformI18n(key) : value;
}

function translateStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const defaultValues = props.defaultValues as FieldValues & ConfigCenterFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & ConfigCenterFormVO);
const formComputed = computed(() => form.value);

const translatedConfigTypeOptions = computed(() =>
	configTypeOptions.map((option) => ({
		...option,
		label: translateConfigType(String(option.value)),
	})),
);

const translatedStatusOptions = computed(() =>
	configStatusOptions.map((option) => ({
		...option,
		label: translateStatus(String(option.value)),
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configName")),
		prop: "configName",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.configName")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configType")),
		prop: "configType",
		valueType: "select",
		required: true,
		width: "180px",
		options: translatedConfigTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.configType")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configKey")),
		prop: "configKey",
		valueType: "input",
		required: true,
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.configKey")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configValue")),
		prop: "configValue",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.configValue")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.defaultValue")),
		prop: "defaultValue",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.defaultValue")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.configDescription")),
		prop: "configDescription",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.configDescription")),
			rows: 3,
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.status")),
		prop: "status",
		valueType: "select",
		required: true,
		width: "120px",
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.status")),
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.sortOrder")),
		prop: "sortOrder",
		valueType: "input-number",
		width: "150px",
		fieldProps: {
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.sortOrder")),
			min: 0,
			max: 9999,
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.configManage.center.form.placeholders.remark")),
			rows: 2,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	configName: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.center.form.validation.configNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.configManage.center.form.validation.configNameLength")),
			trigger: "blur",
		},
	],
	configType: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.center.form.validation.configTypeRequired")),
			trigger: "change",
		},
	],
	configKey: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.center.form.validation.configKeyRequired")),
			trigger: "blur",
		},
		{
			pattern: /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/,
			message: transformI18n($t("devTeam.configManage.center.form.validation.configKeyPattern")),
			trigger: "blur",
		},
	],
	configValue: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.center.form.validation.configValueRequired")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.center.form.validation.statusRequired")),
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
