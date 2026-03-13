<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import type { ReportGroupFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type ReportGroupFormProps } from "./form";

const props = defineProps<ReportGroupFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & ReportGroupFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & ReportGroupFormVO);
const formComputed = computed(() => form.value);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.fields.groupName")),
		prop: "groupName",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.placeholders.groupName")),
		},
	},
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.fields.groupUrl")),
		prop: "groupUrl",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.placeholders.groupUrl")),
		},
	},
	{
		label: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		required: true,
		fieldProps: {
			clearable: true,
			rows: 3,
			placeholder: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.placeholders.description")),
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	groupName: [
		{
			required: true,
			message: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.validation.groupNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.validation.groupNameLength")),
			trigger: "blur",
		},
	],
	groupUrl: [
		{
			required: true,
			message: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.validation.groupUrlRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 200,
			message: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.validation.groupUrlLength")),
			trigger: "blur",
		},
	],
	description: [
		{
			required: true,
			message: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.validation.descriptionRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 200,
			message: renderI18n($t("operationTeam.reportConfiguration.reportGroup.form.validation.descriptionLength")),
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
