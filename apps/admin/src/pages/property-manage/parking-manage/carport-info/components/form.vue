<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { CarportInfoFormVO } from "@01s-11comm/type";
import { parkingLotOptions, parkingSpaceStatusOptions, parkingSpaceTypeOptions } from "@01s-11comm/type";
import type { CarportInfoFormProps } from "./form";

const props = defineProps<CarportInfoFormProps>();
const { locale } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & CarportInfoFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & CarportInfoFormVO);
const formComputed = computed(() => form.value);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingLot")),
		prop: "parkingLot",
		valueType: "select",
		options: parkingLotOptions,
		fieldProps: { clearable: true },
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingSpace")),
		prop: "parkingSpace",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_parking-manage.carport-info.placeholders.parkingSpace")),
		},
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingSpaceStatus")),
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions,
		fieldProps: { clearable: true },
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.parkingSpaceType")),
		prop: "parkingSpaceType",
		valueType: "select",
		options: parkingSpaceTypeOptions,
		fieldProps: { clearable: true },
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.area")),
		prop: "area",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_parking-manage.carport-info.placeholders.area")),
		},
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_parking-manage.carport-info.placeholders.ownerName")),
		},
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_parking-manage.carport-info.placeholders.contactPhone")),
		},
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.vehicleNumber")),
		prop: "vehicleNumber",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_parking-manage.carport-info.placeholders.vehicleNumber")),
		},
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.purchaseDate")),
		prop: "purchaseDate",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			placeholder: transformI18n($t("property-manage_parking-manage.carport-info.placeholders.purchaseDate")),
		},
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.expiryDate")),
		prop: "expiryDate",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			placeholder: transformI18n($t("property-manage_parking-manage.carport-info.placeholders.expiryDate")),
		},
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.monthlyRent")),
		prop: "monthlyRent",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			precision: 2,
			placeholder: transformI18n($t("property-manage_parking-manage.carport-info.placeholders.monthlyRent")),
		},
	},
	{
		label: transformI18n($t("property-manage_parking-manage.carport-info.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			placeholder: transformI18n($t("property-manage_parking-manage.carport-info.placeholders.remark")),
			rows: 3,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	parkingLot: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-info.rules.parkingLot")),
			trigger: "change",
		},
	],
	parkingSpace: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-info.rules.parkingSpace")),
			trigger: "blur",
		},
	],
	parkingSpaceStatus: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-info.rules.parkingSpaceStatus")),
			trigger: "change",
		},
	],
	parkingSpaceType: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-info.rules.parkingSpaceType")),
			trigger: "change",
		},
	],
	area: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.carport-info.rules.area")),
			trigger: "blur",
		},
	],
	contactPhone: [
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_parking-manage.carport-info.rules.contactPhoneFormat")),
			trigger: "blur",
		},
	],
	monthlyRent: [
		{
			type: "number",
			min: 0,
			message: transformI18n($t("property-manage_parking-manage.carport-info.rules.monthlyRent")),
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
