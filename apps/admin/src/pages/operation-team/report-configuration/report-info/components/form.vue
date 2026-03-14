<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import type { ReportInfoFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type ReportInfoFormProps } from "./form";

const props = defineProps<ReportInfoFormProps>();
const { locale, withLocale } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & ReportInfoFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & ReportInfoFormVO);
const formComputed = computed(() => form.value);

const reportGroupOptions = withLocale(() => [
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.options.groups.test")),
		value: "测试报表组",
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.options.groups.inspection")),
		value: "巡检报表",
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.options.groups.business")),
		value: "营业报表",
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.options.groups.repair")),
		value: "报修报表",
	},
]);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.fields.reportGroup")),
		prop: "reportGroup",
		valueType: "select",
		options: reportGroupOptions.value,
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.placeholders.reportGroup")),
		},
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.fields.optionTitle")),
		prop: "optionTitle",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.placeholders.optionTitle")),
		},
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.fields.sort")),
		prop: "sort",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.placeholders.sort")),
		},
	},
	{
		label: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		required: true,
		fieldProps: {
			clearable: true,
			rows: 3,
			placeholder: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.placeholders.description")),
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	reportGroup: [
		{
			required: true,
			message: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.validation.reportGroupRequired")),
			trigger: "change",
		},
	],
	optionTitle: [
		{
			required: true,
			message: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.validation.optionTitleRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.validation.optionTitleLength")),
			trigger: "blur",
		},
	],
	sort: [
		{
			required: true,
			message: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.validation.sortRequired")),
			trigger: "blur",
		},
		{
			pattern: /^[1-9]\d*$/,
			message: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.validation.sortPattern")),
			trigger: "blur",
		},
	],
	description: [
		{
			required: true,
			message: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.validation.descriptionRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 200,
			message: transformI18n($t("operationTeam.reportConfiguration.reportInfo.form.validation.descriptionLength")),
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
