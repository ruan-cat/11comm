<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { IssuesSettingFormProps } from "./form";
import {
	type IssuesFormVO,
	repairTypeOptions,
	repairCategoryOptions,
	repairsIssuesStatusOptions,
} from "@01s-11comm/type";

const props = defineProps<IssuesSettingFormProps>();

const { computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & IssuesFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & IssuesFormVO;

const form = ref(toRefForm);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.workOrderCode")),
		prop: "workOrderCode",
		valueType: "input",
		fieldProps: { disabled: true },
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.location")),
		prop: "location",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.maintenanceType")),
		prop: "maintenanceType",
		valueType: "select",
		options: repairCategoryOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.contactInfo")),
		prop: "contactInfo",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.appointmentTimeRange")),
		prop: "appointmentTimeRange",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.submitTime")),
		prop: "submitTime",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.orderDuration")),
		prop: "orderDuration",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.completeTime")),
		prop: "completeTime",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.status")),
		prop: "status",
		valueType: "select",
		options: repairsIssuesStatusOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.violationDescription")),
		prop: "violationDescription",
		valueType: "textarea",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.form.fields.remark")),
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	location: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.issues.form.validation.locationRequired")),
			trigger: "blur",
		},
	],
	repairType: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.issues.form.validation.repairTypeRequired")),
			trigger: "change",
		},
	],
	maintenanceType: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.issues.form.validation.maintenanceTypeRequired")),
			trigger: "change",
		},
	],
	reporter: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.issues.form.validation.reporterRequired")),
			trigger: "blur",
		},
	],
	contactInfo: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.issues.form.validation.contactInfoRequired")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.issues.form.validation.statusRequired")),
			trigger: "change",
		},
	],
}));

/** 动态计算的表单项配置 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 对外导出 */
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
