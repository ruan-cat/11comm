<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { SystemConfigFormVO } from "@01s-11comm/type";
import { systemConfigSystemOptions, systemConfigTypeOptions } from "@01s-11comm/type";
import { type SystemConfigFormProps } from "./form";

const props = defineProps<SystemConfigFormProps>();
const { computed } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & SystemConfigFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & SystemConfigFormVO);
const formComputed = computed(() => form.value);

const configTypeLabelKeys = [
	"operationTeam.systemManage.systemConfig.options.configTypes.text",
	"operationTeam.systemManage.systemConfig.options.configTypes.number",
	"operationTeam.systemManage.systemConfig.options.configTypes.boolean",
	"operationTeam.systemManage.systemConfig.options.configTypes.json",
	"operationTeam.systemManage.systemConfig.options.configTypes.url",
] as const;

const systemLabelKeys = [
	"operationTeam.systemManage.systemConfig.options.systems.yes",
	"operationTeam.systemManage.systemConfig.options.systems.no",
] as const;

const translatedSystemConfigTypeOptions = computed(() =>
	systemConfigTypeOptions.map((item, index) => ({
		...item,
		label: transformI18n($t(configTypeLabelKeys[index] ?? configTypeLabelKeys[0])),
	})),
);

const translatedSystemOptions = computed(() =>
	systemConfigSystemOptions.map((item, index) => ({
		...item,
		label: transformI18n($t(systemLabelKeys[index] ?? systemLabelKeys[0])),
	})),
);

const translatedStatusOptions = computed(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.enabled")),
		value: "Enabled",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.disabled")),
		value: "Disabled",
	},
]);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configName")),
		prop: "configName",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.configName")),
			maxlength: 50,
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configValue")),
		prop: "configValue",
		valueType: "textarea",
		width: "300px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.configValue")),
			rows: 3,
			maxlength: 1000,
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configType")),
		prop: "configType",
		valueType: "select",
		width: "150px",
		required: true,
		options: translatedSystemConfigTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.configType")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configKey")),
		prop: "configKey",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.configKey")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.isSystem")),
		prop: "isSystem",
		valueType: "select",
		width: "120px",
		required: true,
		options: translatedSystemOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.isSystem")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.status")),
		prop: "status",
		valueType: "select",
		width: "120px",
		required: true,
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.status")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.description")),
		prop: "description",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.description")),
			rows: 4,
			maxlength: 200,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	configName: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.configNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.configNameLength")),
			trigger: "blur",
		},
	],
	configKey: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.configKeyRequired")),
			trigger: "blur",
		},
		{
			min: 1,
			max: 100,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.configKeyLength")),
			trigger: "blur",
		},
	],
	configValue: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.configValueRequired")),
			trigger: "blur",
		},
		{
			min: 1,
			max: 1000,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.configValueLength")),
			trigger: "blur",
		},
	],
	configType: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.configTypeRequired")),
			trigger: "change",
		},
	],
	isSystem: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.isSystemRequired")),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.statusRequired")),
			trigger: "change",
		},
	],
	description: [
		{
			max: 200,
			message: transformI18n($t("operationTeam.systemManage.systemConfig.validation.descriptionLength")),
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
