<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { RepairsHaveDoneFormProps } from "./form";
import type { RepairsHaveDoneFormVO } from "@01s-11comm/type";
import { repairTypeOptions, maintenanceTypeOptions, repairStatusOptions } from "@01s-11comm/type";

const props = defineProps<RepairsHaveDoneFormProps>();

const defaultValues = props.defaultValues as FieldValues & RepairsHaveDoneFormVO;

const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & RepairsHaveDoneFormVO;

const form = ref(toRefForm);
const formComputed = computed(() => form.value);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.fields.workOrderNumber")),
		prop: "workOrderNumber",
		valueType: "input",
		fieldProps: { disabled: true },
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.fields.location")),
		prop: "location",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.fields.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.fields.maintenanceType")),
		prop: "maintenanceType",
		valueType: "select",
		options: maintenanceTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.fields.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.fields.contactInfo")),
		prop: "contactInfo",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.fields.appointmentTime")),
		prop: "appointmentTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.fields.status")),
		prop: "status",
		valueType: "select",
		options: repairStatusOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.fields.remark")),
		prop: "remark",
		valueType: "textarea",
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	location: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.validation.locationRequired")),
			trigger: "blur",
		},
	],
	repairType: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.validation.repairTypeRequired")),
			trigger: "change",
		},
	],
	maintenanceType: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.repairs-have-done.form.validation.maintenanceTypeRequired"),
			),
			trigger: "change",
		},
	],
	reporter: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.validation.reporterRequired")),
			trigger: "blur",
		},
	],
	contactInfo: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.validation.contactInfoRequired")),
			trigger: "blur",
		},
	],
	appointmentTime: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.repairs-have-done.form.validation.appointmentTimeRequired"),
			),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-have-done.form.validation.statusRequired")),
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
