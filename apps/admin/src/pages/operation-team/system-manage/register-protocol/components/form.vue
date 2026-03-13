<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { RegisterProtocolFormVO } from "@01s-11comm/type";
import { protocolTypeOptions } from "@01s-11comm/type";
import { RegisterProtocolFormProps } from "./form";

const props = defineProps<RegisterProtocolFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & RegisterProtocolFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & RegisterProtocolFormVO;
const form = ref(toRefForm);
const formComputed = computed(() => {
	return form.value;
});

const protocolTypeLabelKeys = [
	"operationTeam.systemManage.registerProtocol.options.protocolTypes.userRegistration",
	"operationTeam.systemManage.registerProtocol.options.protocolTypes.privacyPolicy",
	"operationTeam.systemManage.registerProtocol.options.protocolTypes.serviceTerms",
	"operationTeam.systemManage.registerProtocol.options.protocolTypes.disclaimer",
	"operationTeam.systemManage.registerProtocol.options.protocolTypes.copyright",
] as const;

const translatedProtocolTypeOptions = withLocale(() =>
	protocolTypeOptions.map((item, index) => ({
		...item,
		label: renderI18n($t(protocolTypeLabelKeys[index] ?? protocolTypeLabelKeys[0])),
	})),
);

const translatedStatusOptions = withLocale(() => [
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.options.statuses.draft")),
		value: "Draft",
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.options.enabledStatuses.enabled")),
		value: "Enabled",
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.options.enabledStatuses.disabled")),
		value: "Disabled",
	},
]);

const translatedRequiredOptions = withLocale(() => [
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.options.requiredStatuses.yes")),
		value: "Yes",
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.options.requiredStatuses.no")),
		value: "No",
	},
]);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolName")),
		prop: "protocolName",
		valueType: "input",
		required: true,
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.protocolName")),
			maxlength: 100,
		},
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolType")),
		prop: "protocolType",
		valueType: "select",
		required: true,
		width: "200px",
		options: translatedProtocolTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.protocolType")),
		},
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolVersion")),
		prop: "protocolVersion",
		valueType: "input",
		required: true,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.protocolVersion")),
		},
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.status")),
		prop: "status",
		valueType: "select",
		required: true,
		width: "150px",
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.status")),
		},
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.isRequired")),
		prop: "isMandatory",
		valueType: "select",
		required: true,
		width: "150px",
		options: translatedRequiredOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.isRequired")),
		},
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.effectiveDate")),
		prop: "effectiveDate",
		valueType: "date-picker",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			type: "date",
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.effectiveDate")),
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
			disabledDate: (time: Date) => {
				return time.getTime() < Date.now() - 8.64e7;
			},
		},
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.expirationDate")),
		prop: "expirationDate",
		valueType: "date-picker",
		width: "200px",
		fieldProps: {
			clearable: true,
			type: "date",
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.expirationDate")),
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
			disabledDate: (time: Date, formValues: any) => {
				if (formValues?.effectiveDate) {
					return time.getTime() <= new Date(formValues.effectiveDate).getTime();
				}
				return false;
			},
		},
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.sortWeight")),
		prop: "sortWeight",
		valueType: "input-number",
		width: "150px",
		fieldProps: {
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.sortWeight")),
			min: 0,
			max: 9999,
			controls: true,
		},
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolSummary")),
		prop: "protocolSummary",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.protocolSummary")),
			maxlength: 500,
			showWordLimit: true,
			rows: 3,
			resize: "vertical",
		},
	},
	{
		label: renderI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolContent")),
		prop: "protocolContent",
		valueType: "textarea",
		required: true,
		width: "100%",
		fieldProps: {
			placeholder: renderI18n($t("operationTeam.systemManage.registerProtocol.placeholders.protocolContent")),
			maxlength: 50000,
			showWordLimit: true,
			rows: 15,
			resize: "vertical",
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	protocolName: [
		{
			required: true,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.protocolNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.protocolNameLength")),
			trigger: "blur",
		},
	],
	protocolType: [
		{
			required: true,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.protocolTypeRequired")),
			trigger: "change",
		},
	],
	protocolVersion: [
		{
			required: true,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.protocolVersionRequired")),
			trigger: "blur",
		},
		{
			pattern: /^v?\d+\.\d+\.\d+$/,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.protocolVersionFormat")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.statusRequired")),
			trigger: "change",
		},
	],
	isMandatory: [
		{
			required: true,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.isRequiredRequired")),
			trigger: "change",
		},
	],
	protocolContent: [
		{
			required: true,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.protocolContentRequired")),
			trigger: "blur",
		},
		{
			min: 100,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.protocolContentLength")),
			trigger: "blur",
		},
	],
	effectiveDate: [
		{
			required: true,
			message: renderI18n($t("operationTeam.systemManage.registerProtocol.validation.effectiveDateRequired")),
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
