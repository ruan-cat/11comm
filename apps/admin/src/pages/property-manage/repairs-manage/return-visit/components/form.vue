<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { ReturnVisitFormProps } from "./form";
import type { ReturnVisitFormVO } from "@01s-11comm/type";
import { repairTypeOptions, returnVisitStatusOptions } from "@01s-11comm/type";

const props = defineProps<ReturnVisitFormProps>();

const { computed } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & ReturnVisitFormVO;

const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & ReturnVisitFormVO;

const form = ref(toRefForm);
const formComputed = computed(() => form.value);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.form.fields.workOrderNumber")),
		prop: "workOrderNumber",
		valueType: "input",
		fieldProps: { disabled: true },
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.form.fields.location")),
		prop: "location",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.form.fields.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.form.fields.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.form.fields.contactInfo")),
		prop: "contactInfo",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.form.fields.appointmentTime")),
		prop: "appointmentTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.form.fields.returnVisitStatus")),
		prop: "returnVisitStatus",
		valueType: "select",
		options: returnVisitStatusOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.form.fields.remark")),
		prop: "remark",
		valueType: "textarea",
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	location: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.return-visit.form.validation.locationRequired")),
			trigger: "blur",
		},
	],
	repairType: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.return-visit.form.validation.repairTypeRequired")),
			trigger: "change",
		},
	],
	reporter: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.return-visit.form.validation.reporterRequired")),
			trigger: "blur",
		},
	],
	contactInfo: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.return-visit.form.validation.contactInfoRequired")),
			trigger: "blur",
		},
	],
	appointmentTime: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.return-visit.form.validation.appointmentTimeRequired")),
			trigger: "change",
		},
	],
	returnVisitStatus: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.return-visit.form.validation.returnVisitStatusRequired")),
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
