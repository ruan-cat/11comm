<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { componentTypeOptions, queryMethodOptions, type ReportComponentFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type ReportComponentFormProps } from "./form";

const props = defineProps<ReportComponentFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const componentTypeLabelKeyMap: Record<string, string> = {
	表格: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.table"),
	table: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.table"),
	图表: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.chart"),
	chart: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.chart"),
	摘要: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.summary"),
	summary: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.summary"),
	文本: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.text"),
	text: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.text"),
	图片: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.image"),
	image: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.image"),
	按钮: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.button"),
	button: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.button"),
	输入框: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.input"),
	input: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.input"),
	下拉框: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.select"),
	select: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.select"),
	日期选择器: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.datePicker"),
	datePicker: $t("operationTeam.reportConfiguration.reportComponent.form.options.componentTypes.datePicker"),
};

const queryMethodLabelKeyMap = {
	sql: $t("operationTeam.reportConfiguration.reportComponent.form.options.queryMethods.sql"),
	api: $t("operationTeam.reportConfiguration.reportComponent.form.options.queryMethods.api"),
	local: $t("operationTeam.reportConfiguration.reportComponent.form.options.queryMethods.local"),
} as const;

function translateComponentType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	return renderI18n(componentTypeLabelKeyMap[value] ?? value);
}

function translateQueryMethod(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = queryMethodLabelKeyMap[value as keyof typeof queryMethodLabelKeyMap];
	return key ? renderI18n(key) : value;
}

const defaultValues = props.defaultValues as FieldValues & ReportComponentFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & ReportComponentFormVO);
const formComputed = computed(() => form.value);

const translatedComponentTypeOptions = withLocale(() =>
	componentTypeOptions.map((option) => ({
		...option,
		label: translateComponentType(String(option.value)),
	})),
);

const translatedQueryMethodOptions = withLocale(() =>
	queryMethodOptions.map((option) => ({
		...option,
		label: translateQueryMethod(String(option.value)),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.fields.componentName")),
		prop: "componentName",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.placeholders.componentName")),
		},
	},
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.fields.componentType")),
		prop: "componentType",
		valueType: "select",
		required: true,
		options: translatedComponentTypeOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.placeholders.componentType")),
		},
	},
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.fields.queryMethod")),
		prop: "queryMethod",
		valueType: "select",
		required: true,
		options: translatedQueryMethodOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.placeholders.queryMethod")),
		},
	},
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.fields.sql")),
		prop: "sql",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.placeholders.sql")),
		},
		hidden: () => form.value.queryMethod !== "sql",
	},
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.fields.java")),
		prop: "java",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.placeholders.java")),
		},
		hidden: () => form.value.queryMethod === "sql",
	},
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			placeholder: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.placeholders.description")),
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	componentName: [
		{
			required: true,
			message: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.validation.componentNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.validation.componentNameLength")),
			trigger: "blur",
		},
	],
	componentType: [
		{
			required: true,
			message: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.validation.componentTypeRequired")),
			trigger: "change",
		},
	],
	queryMethod: [
		{
			required: true,
			message: renderI18n($t("operationTeam.reportConfiguration.reportComponent.form.validation.queryMethodRequired")),
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
