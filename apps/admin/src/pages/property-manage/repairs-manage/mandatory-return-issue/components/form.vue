<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { MandatoryReturnIssueFormProps } from "./form";
import type { MandatoryReturnIssueFormVO } from "@01s-11comm/type";
import { repairTypeOptions, mandatoryReturnIssueStatusOptions } from "@01s-11comm/type";

const props = defineProps<MandatoryReturnIssueFormProps>();

const { withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & MandatoryReturnIssueFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & MandatoryReturnIssueFormVO;

const form = ref(toRefForm);
const formComputed = computed(() => form.value);

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.fields.workOrderNumber")),
		prop: "workOrderNumber",
		valueType: "input",
		fieldProps: { disabled: true },
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.fields.location")),
		prop: "location",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.fields.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.fields.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.fields.contactInfo")),
		prop: "contactInfo",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.fields.appointmentTime")),
		prop: "appointmentTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.fields.submitTime")),
		prop: "submitTime",
		valueType: "input",
		fieldProps: { disabled: true },
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.fields.status")),
		prop: "status",
		valueType: "select",
		options: mandatoryReturnIssueStatusOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.fields.remark")),
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	location: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.mandatory-return-issue.form.validation.locationRequired"),
			),
			trigger: "blur",
		},
	],
	repairType: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.mandatory-return-issue.form.validation.repairTypeRequired"),
			),
			trigger: "change",
		},
	],
	reporter: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.mandatory-return-issue.form.validation.reporterRequired"),
			),
			trigger: "blur",
		},
	],
	contactInfo: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.mandatory-return-issue.form.validation.contactInfoRequired"),
			),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.form.validation.statusRequired")),
			trigger: "change",
		},
	],
}));

const plusFormColumnsComputed = computed(() => plusFormColumns.value);

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
			:columns="plusFormColumnsComputed"
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
