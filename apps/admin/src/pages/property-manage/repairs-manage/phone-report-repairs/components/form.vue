<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { PhoneRepairsFormProps } from "./form";
import type { PhoneRepairsFormVO } from "@01s-11comm/type";
import { repairTypeOptions } from "@01s-11comm/type";

const props = defineProps<PhoneRepairsFormProps>();


const defaultValues = props.defaultValues as FieldValues & PhoneRepairsFormVO;

const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & PhoneRepairsFormVO;

const form = ref(toRefForm);
const formComputed = computed(() => form.value);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.form.fields.repairScope")),
		prop: "repairScope",
		valueType: "select",
		options: [
			{
				label: transformI18n(
					$t("propertyManage_repairsManage.phone-report-repairs.form.options.repairScope.communityPublic"),
				),
				value: "小区公区",
			},
			{
				label: transformI18n(
					$t("propertyManage_repairsManage.phone-report-repairs.form.options.repairScope.ownerPrivate"),
				),
				value: "业主自用",
			},
		],
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.form.fields.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.form.fields.reporter")),
		prop: "reporter",
		valueType: "input",
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.form.fields.contactInfo")),
		prop: "contactInfo",
		valueType: "input",
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.form.fields.appointmentTime")),
		prop: "appointmentTime",
		valueType: "date-picker",
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.form.fields.repairDescription")),
		prop: "repairDescription",
		valueType: "textarea",
		required: true,
	},
]);

const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	repairScope: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.phone-report-repairs.form.validation.repairScopeRequired"),
			),
			trigger: "change",
		},
	],
	repairType: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.phone-report-repairs.form.validation.repairTypeRequired"),
			),
			trigger: "change",
		},
	],
	reporter: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.phone-report-repairs.form.validation.reporterRequired")),
			trigger: "blur",
		},
	],
	contactInfo: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.phone-report-repairs.form.validation.contactInfoRequired"),
			),
			trigger: "blur",
		},
	],
	appointmentTime: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.phone-report-repairs.form.validation.appointmentTimeRequired"),
			),
			trigger: "change",
		},
	],
	repairDescription: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.phone-report-repairs.form.validation.repairDescriptionRequired"),
			),
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
