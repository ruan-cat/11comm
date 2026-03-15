<!--
  车位申请表单
  用于新增 修改车位申请
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { CarportApplyFormVO } from "@01s-11comm/type";
import { carBrandOptions, vehicleTypeOptions, vehicleColorOptions, auditStatusOptions } from "@01s-11comm/type";
import type { CarportApplyFormProps } from "./form";

const props = defineProps<CarportApplyFormProps>();
const { locale, computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & CarportApplyFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & CarportApplyFormVO);
const formComputed = computed(() => form.value);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.licensePlate")),
		prop: "licensePlate",
		valueType: "input",
		required: true,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.parkingSpace")),
		prop: "parkingSpace",
		valueType: "input",
		required: true,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.carBrand")),
		prop: "carBrand",
		valueType: "select",
		options: carBrandOptions,
		required: true,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.vehicleType")),
		prop: "vehicleType",
		valueType: "select",
		options: vehicleTypeOptions,
		required: true,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.color")),
		prop: "color",
		valueType: "select",
		options: vehicleColorOptions,
		required: true,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.startLeaseTime")),
		prop: "startLeaseTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.endLeaseTime")),
		prop: "endLeaseTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.applicant")),
		prop: "applicant",
		valueType: "input",
		required: true,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.phoneNumber")),
		prop: "phoneNumber",
		valueType: "input",
		required: true,
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-apply.fields.reviewResult")),
		prop: "reviewResult",
		valueType: "select",
		options: auditStatusOptions,
		required: true,
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	licensePlate: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.licensePlate")),
			trigger: "blur",
		},
	],
	parkingSpace: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.parkingSpace")),
			trigger: "blur",
		},
	],
	carBrand: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.carBrand")),
			trigger: "change",
		},
	],
	vehicleType: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.vehicleType")),
			trigger: "change",
		},
	],
	color: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.color")),
			trigger: "change",
		},
	],
	startLeaseTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.startLeaseTime")),
			trigger: "change",
		},
	],
	endLeaseTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.endLeaseTime")),
			trigger: "change",
		},
	],
	applicant: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.applicant")),
			trigger: "blur",
		},
	],
	phoneNumber: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.phoneNumber")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.phoneNumberFormat")),
			trigger: "blur",
		},
	],
	reviewResult: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-apply.rules.reviewResult")),
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
	<section :key="locale" class="form-root">
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
