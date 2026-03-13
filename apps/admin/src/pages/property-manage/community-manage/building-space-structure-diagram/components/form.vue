<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import type { BuildingSpaceStructureDiagramFormVO } from "@01s-11comm/type";
import type { BuildingSpaceStructureDiagramFormProps } from "./form";

const props = defineProps<BuildingSpaceStructureDiagramFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & BuildingSpaceStructureDiagramFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & BuildingSpaceStructureDiagramFormVO);
const formComputed = computed(() => form.value);

const buildingStructureLabelKeyMap = {
	"钢筋混凝土结构":
		"propertyManage_communityManage.building-space-structure-diagram.options.structure.reinforcedConcrete",
	钢结构: "propertyManage_communityManage.building-space-structure-diagram.options.structure.steel",
	砖混结构: "propertyManage_communityManage.building-space-structure-diagram.options.structure.brickConcrete",
	框架结构: "propertyManage_communityManage.building-space-structure-diagram.options.structure.frame",
	剪力墙结构: "propertyManage_communityManage.building-space-structure-diagram.options.structure.shearWall",
} as const;

const buildingStatusLabelKeyMap = {
	正常使用: "propertyManage_communityManage.building-space-structure-diagram.options.status.normal",
	装修中: "propertyManage_communityManage.building-space-structure-diagram.options.status.renovating",
	维修中: "propertyManage_communityManage.building-space-structure-diagram.options.status.repairing",
	待验收:
		"propertyManage_communityManage.building-space-structure-diagram.options.status.pendingAcceptance",
	已停用: "propertyManage_communityManage.building-space-structure-diagram.options.status.disabled",
} as const;

const buildingStructureOptions = withLocale(() =>
	Object.entries(buildingStructureLabelKeyMap).map(([value, key]) => ({
		label: renderI18n($t(key)),
		value,
	})),
);

const buildingStatusOptions = withLocale(() =>
	Object.entries(buildingStatusLabelKeyMap).map(([value, key]) => ({
		label: renderI18n($t(key)),
		value,
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingId")),
		prop: "buildingId",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.buildingId"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingName")),
		prop: "buildingName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.buildingName"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.totalFloors")),
		prop: "totalFloors",
		valueType: "input-number",
		fieldProps: {
			min: 1,
			max: 100,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.totalFloors"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.building-space-structure-diagram.fields.totalHouseholds"),
		),
		prop: "totalHouseholds",
		valueType: "input-number",
		fieldProps: {
			min: 1,
			max: 1000,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.totalHouseholds"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingArea")),
		prop: "buildingArea",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			precision: 1,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.buildingArea"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.building-space-structure-diagram.fields.buildingStructure"),
		),
		prop: "buildingStructure",
		valueType: "select",
		options: buildingStructureOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.buildingStructure"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.building-space-structure-diagram.fields.constructionYear"),
		),
		prop: "constructionYear",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.constructionYear"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.drawingPath")),
		prop: "drawingPath",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.drawingPath"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.status")),
		prop: "status",
		valueType: "select",
		options: buildingStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.status"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.building-space-structure-diagram.fields.personInCharge"),
		),
		prop: "personInCharge",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.personInCharge"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.contactPhone"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.building-space-structure-diagram.fields.remarks")),
		prop: "remarks",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.placeholders.remarks"),
			),
			disabled: props.mode === "info",
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	buildingId: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.enterBuildingId"),
			),
			trigger: "blur",
		},
	],
	buildingName: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.enterBuildingName"),
			),
			trigger: "blur",
		},
	],
	totalFloors: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.enterTotalFloors"),
			),
			trigger: "blur",
		},
	],
	totalHouseholds: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.enterTotalHouseholds"),
			),
			trigger: "blur",
		},
	],
	buildingArea: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.enterBuildingArea"),
			),
			trigger: "blur",
		},
	],
	buildingStructure: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.selectBuildingStructure"),
			),
			trigger: "change",
		},
	],
	constructionYear: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.enterConstructionYear"),
			),
			trigger: "blur",
		},
	],
	drawingPath: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.enterDrawingPath"),
			),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.selectStatus"),
			),
			trigger: "change",
		},
	],
	personInCharge: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.enterPersonInCharge"),
			),
			trigger: "blur",
		},
	],
	contactPhone: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.enterContactPhone"),
			),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: renderI18n(
				$t("propertyManage_communityManage.building-space-structure-diagram.form.validation.contactPhonePattern"),
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
