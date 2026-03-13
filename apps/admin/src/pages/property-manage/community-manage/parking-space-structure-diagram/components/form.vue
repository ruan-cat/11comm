<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import type { ParkingSpaceStructureDiagramFormVO } from "@01s-11comm/type";
import type { ParkingSpaceStructureDiagramFormProps } from "./form";

const props = defineProps<ParkingSpaceStructureDiagramFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & ParkingSpaceStructureDiagramFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & ParkingSpaceStructureDiagramFormVO);
const formComputed = computed(() => form.value);

const parkingSpaceTypeLabelKeyMap = {
	地下车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.underground",
	地面车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.ground",
	子母车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.childMother",
	无障碍车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.accessible",
	机械车位: "propertyManage_communityManage.parking-space-structure-diagram.options.type.mechanical",
} as const;

const parkingSpaceStatusLabelKeyMap = {
	空闲: "propertyManage_communityManage.parking-space-structure-diagram.options.status.idle",
	已售: "propertyManage_communityManage.parking-space-structure-diagram.options.status.sold",
	已租: "propertyManage_communityManage.parking-space-structure-diagram.options.status.rented",
	维修中: "propertyManage_communityManage.parking-space-structure-diagram.options.status.maintaining",
	其他: "propertyManage_communityManage.parking-space-structure-diagram.options.status.other",
} as const;

const orientationLabelKeyMap = {
	靠墙: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.wall",
	中间: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.middle",
	靠柱: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.column",
	露天: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.outdoor",
	机械车位: "propertyManage_communityManage.parking-space-structure-diagram.options.orientation.mechanical",
} as const;

const floorAreaLabelKeyMap = {
	地下1层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.b1",
	地下2层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.b2",
	地下3层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.b3",
	地面层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.ground",
	架空层: "propertyManage_communityManage.parking-space-structure-diagram.options.floorArea.elevated",
} as const;

const booleanLabelKeyMap = {
	是: "propertyManage_communityManage.parking-space-structure-diagram.options.boolean.yes",
	否: "propertyManage_communityManage.parking-space-structure-diagram.options.boolean.no",
} as const;

const chargingPilePowerLabelKeyMap = {
	"3.5kW": "propertyManage_communityManage.parking-space-structure-diagram.options.chargingPower.kw35",
	"7kW": "propertyManage_communityManage.parking-space-structure-diagram.options.chargingPower.kw7",
	"11kW": "propertyManage_communityManage.parking-space-structure-diagram.options.chargingPower.kw11",
	"20kW": "propertyManage_communityManage.parking-space-structure-diagram.options.chargingPower.kw20",
	"22kW": "propertyManage_communityManage.parking-space-structure-diagram.options.chargingPower.kw22",
	"7kW/3.5kW": "propertyManage_communityManage.parking-space-structure-diagram.options.chargingPower.kw7_35",
	"11kW/7kW": "propertyManage_communityManage.parking-space-structure-diagram.options.chargingPower.kw11_7",
	其他: "propertyManage_communityManage.parking-space-structure-diagram.options.chargingPower.other",
} as const;

function buildOptionList<T extends Record<string, string>>(labelMap: T) {
	return Object.entries(labelMap).map(([value, key]) => ({
		label: renderI18n($t(key)),
		value,
	}));
}

const parkingSpaceTypeOptions = withLocale(() => buildOptionList(parkingSpaceTypeLabelKeyMap));
const parkingSpaceStatusOptions = withLocale(() => buildOptionList(parkingSpaceStatusLabelKeyMap));
const orientationOptions = withLocale(() => buildOptionList(orientationLabelKeyMap));
const floorAreaOptions = withLocale(() => buildOptionList(floorAreaLabelKeyMap));
const booleanOptions = withLocale(() => buildOptionList(booleanLabelKeyMap));
const chargingPilePowerOptions = withLocale(() => buildOptionList(chargingPilePowerLabelKeyMap));

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceNumber")),
		prop: "parkingSpaceNumber",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.parkingSpaceNumber"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceType")),
		prop: "parkingSpaceType",
		valueType: "select",
		options: parkingSpaceTypeOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.parkingSpaceType"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceStatus"),
		),
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.parkingSpaceStatus"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceLocation"),
		),
		prop: "parkingSpaceLocation",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.parkingSpaceLocation"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceArea")),
		prop: "parkingSpaceArea",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.parkingSpaceArea"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.parking-space-structure-diagram.fields.parkingSpaceOrientation"),
		),
		prop: "parkingSpaceOrientation",
		valueType: "select",
		options: orientationOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.parkingSpaceOrientation"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.floorArea")),
		prop: "floorArea",
		valueType: "select",
		options: floorAreaOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.floorArea"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.ownerName"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.contactPhone"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.parking-space-structure-diagram.fields.licensePlateNumber"),
		),
		prop: "licensePlateNumber",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.licensePlateNumber"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.vehicleBrand")),
		prop: "vehicleBrand",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.vehicleBrand"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.purchaseTime")),
		prop: "purchaseTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.purchaseTime"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.expiryTime")),
		prop: "expiryTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.expiryTime"),
			),
			disabled: props.mode === "info",
		},
		hidden: (currentForm: ParkingSpaceStructureDiagramFormVO) => currentForm.parkingSpaceStatus !== "已租",
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.monthlyRent")),
		prop: "monthlyRent",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			step: 10,
			controlsPosition: "right",
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.monthlyRent"),
			),
			disabled: props.mode === "info",
		},
		hidden: (currentForm: ParkingSpaceStructureDiagramFormVO) => currentForm.parkingSpaceStatus !== "已租",
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.managementFee")),
		prop: "managementFee",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			step: 5,
			controlsPosition: "right",
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.managementFee"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.parking-space-structure-diagram.fields.hasEvChargingPile"),
		),
		prop: "hasEvChargingPile",
		valueType: "select",
		options: booleanOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.hasEvChargingPile"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: renderI18n(
			$t("propertyManage_communityManage.parking-space-structure-diagram.fields.chargingPilePower"),
		),
		prop: "chargingPilePower",
		valueType: "select",
		options: chargingPilePowerOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.chargingPilePower"),
			),
			disabled: props.mode === "info",
		},
		hidden: (currentForm: ParkingSpaceStructureDiagramFormVO) => currentForm.hasEvChargingPile !== "是",
	},
	{
		label: renderI18n($t("propertyManage_communityManage.parking-space-structure-diagram.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
			placeholder: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.placeholders.remark"),
			),
			disabled: props.mode === "info",
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	parkingSpaceNumber: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.enterParkingSpaceNumber"),
			),
			trigger: "blur",
		},
	],
	parkingSpaceType: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.selectParkingSpaceType"),
			),
			trigger: "change",
		},
	],
	parkingSpaceStatus: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.selectParkingSpaceStatus"),
			),
			trigger: "change",
		},
	],
	parkingSpaceLocation: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.enterParkingSpaceLocation"),
			),
			trigger: "blur",
		},
	],
	parkingSpaceArea: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.enterParkingSpaceArea"),
			),
			trigger: "blur",
		},
	],
	parkingSpaceOrientation: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.selectParkingSpaceOrientation"),
			),
			trigger: "change",
		},
	],
	floorArea: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.selectFloorArea"),
			),
			trigger: "change",
		},
	],
	contactPhone: [
		{
			pattern: /^1[3-9]\d{9}$/,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.contactPhonePattern"),
			),
			trigger: "blur",
		},
	],
	licensePlateNumber: [
		{
			pattern: /^[\u4E00-\u9FFFA-Z][A-Z][A-Z0-9]{5,6}$/u,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.licensePlateNumberPattern"),
			),
			trigger: "blur",
		},
	],
	expiryTime: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.selectExpiryTime"),
			),
			trigger: "change",
		},
	],
	monthlyRent: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.enterMonthlyRent"),
			),
			trigger: "blur",
		},
	],
	managementFee: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.enterManagementFee"),
			),
			trigger: "blur",
		},
	],
	hasEvChargingPile: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.selectHasEvChargingPile"),
			),
			trigger: "change",
		},
	],
	chargingPilePower: [
		{
			required: true,
			message: renderI18n(
				$t("propertyManage_communityManage.parking-space-structure-diagram.form.validation.selectChargingPilePower"),
			),
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
			:label-width="120"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
