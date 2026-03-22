<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { InitializeCellFormVO } from "@01s-11comm/type";
import { type InitializeCellFormProps } from "./form";

const props = defineProps<InitializeCellFormProps>();
const { locale } = useI18nConfig();

const defaultValues = props.defaultValues as unknown as FieldValues & InitializeCellFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as unknown as FieldValues & InitializeCellFormVO);
const formComputed = computed(() => form.value);

const translatedCellTypeOptions = computed(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.residential")),
		value: "ResidentialUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.commercial")),
		value: "CommercialUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.garage")),
		value: "GarageUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.office")),
		value: "OfficeUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.club")),
		value: "ClubUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.property")),
		value: "PropertyUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.sports")),
		value: "SportsUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.education")),
		value: "EducationUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.medical")),
		value: "MedicalUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.storage")),
		value: "StorageUnit",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.cellTypes.culture")),
		value: "CultureUnit",
	},
]);

const translatedStatusOptions = computed(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.statuses.pending")),
		value: "Uninitialized",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.statuses.inProgress")),
		value: "Initializing",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.statuses.completed")),
		value: "Initialized",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.options.statuses.failed")),
		value: "InitializationFailed",
	},
]);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.fields.cellName")),
		prop: "cellName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.initializeCell.placeholders.cellName")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.fields.cellType")),
		prop: "cellType",
		valueType: "select",
		options: translatedCellTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.initializeCell.placeholders.cellType")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.fields.buildingId")),
		prop: "buildingId",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.initializeCell.placeholders.buildingId")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.fields.buildingName")),
		prop: "buildingName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.initializeCell.placeholders.buildingName")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.fields.floor")),
		prop: "floor",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.initializeCell.placeholders.floor")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.fields.unitNumber")),
		prop: "unitNumber",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.initializeCell.placeholders.unitNumber")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.fields.households")),
		prop: "households",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			max: 1000,
			placeholder: transformI18n($t("operationTeam.systemManage.initializeCell.placeholders.households")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.initializeCell.placeholders.status")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.initializeCell.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.initializeCell.placeholders.description")),
			rows: 3,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	cellName: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.cellNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.cellNameLength")),
			trigger: "blur",
		},
	],
	cellType: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.cellTypeRequired")),
			trigger: "change",
		},
	],
	buildingId: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.buildingIdRequired")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Z0-9]+$/,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.buildingIdPattern")),
			trigger: "blur",
		},
	],
	buildingName: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.buildingNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.buildingNameLength")),
			trigger: "blur",
		},
	],
	floor: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.floorRequired")),
			trigger: "blur",
		},
		{
			min: 1,
			max: 30,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.floorLength")),
			trigger: "blur",
		},
	],
	unitNumber: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.unitNumberRequired")),
			trigger: "blur",
		},
		{
			min: 1,
			max: 20,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.unitNumberLength")),
			trigger: "blur",
		},
	],
	households: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.householdsRequired")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			max: 1000,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.householdsRange")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.statusRequired")),
			trigger: "change",
		},
	],
	description: [
		{
			max: 200,
			message: transformI18n($t("operationTeam.systemManage.initializeCell.validation.descriptionLength")),
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
