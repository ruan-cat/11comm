<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import type { MenuCatalogFormData } from "@01s-11comm/type";
import { groupTypeOptions, storeTypeOptions } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type CatalogFormProps } from "./form";

const props = defineProps<CatalogFormProps>();
const { locale, computed } = useI18nConfig();

const groupTypeOptionLabelMap = {
	system: $t("devTeam.menuManage.catalog.form.options.system"),
	merchant: $t("devTeam.menuManage.catalog.form.options.merchant"),
	custom: $t("devTeam.menuManage.catalog.form.options.custom"),
	temp: $t("devTeam.menuManage.catalog.form.options.temp"),
} as const;

const storeTypeOptionLabelMap = {
	property: $t("devTeam.menuManage.catalog.form.options.property"),
	merchant: $t("devTeam.menuManage.catalog.form.options.merchantPlatform"),
	owner: $t("devTeam.menuManage.catalog.form.options.owner"),
	common: $t("devTeam.menuManage.catalog.form.options.common"),
} as const;

function translateGroupType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = groupTypeOptionLabelMap[value as keyof typeof groupTypeOptionLabelMap];
	return key ? transformI18n(key) : value;
}

function translateStoreType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = storeTypeOptionLabelMap[value as keyof typeof storeTypeOptionLabelMap];
	return key ? transformI18n(key) : value;
}

const defaultValues = props.defaultValues as FieldValues & MenuCatalogFormData;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & MenuCatalogFormData);
const formComputed = computed(() => form.value);

const translatedGroupTypeOptions = computed(() =>
	groupTypeOptions.map((option) => ({
		...option,
		label: translateGroupType(String(option.value)),
	})),
);

const translatedStoreTypeOptions = computed(() =>
	storeTypeOptions.map((option) => ({
		...option,
		label: translateStoreType(String(option.value)),
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.menuManage.catalog.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.catalog.fields.icon")),
		prop: "icon",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.catalog.fields.label")),
		prop: "label",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.catalog.fields.seq")),
		prop: "seq",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			max: 999,
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.catalog.fields.groupType")),
		prop: "groupType",
		valueType: "select",
		options: translatedGroupTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.catalog.fields.storeType")),
		prop: "storeType",
		valueType: "select",
		options: translatedStoreTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.catalog.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			rows: 3,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n($t("devTeam.menuManage.catalog.form.validation.enterName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.menuManage.catalog.form.validation.nameLength")),
			trigger: "blur",
		},
	],
	icon: [
		{
			required: true,
			message: transformI18n($t("devTeam.menuManage.catalog.form.validation.enterIcon")),
			trigger: "blur",
		},
	],
	label: [
		{
			required: true,
			message: transformI18n($t("devTeam.menuManage.catalog.form.validation.enterLabel")),
			trigger: "blur",
		},
	],
	seq: [
		{
			required: true,
			message: transformI18n($t("devTeam.menuManage.catalog.form.validation.enterSeq")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 0,
			max: 999,
			message: transformI18n($t("devTeam.menuManage.catalog.form.validation.seqRange")),
			trigger: "blur",
		},
	],
	groupType: [
		{
			required: true,
			message: transformI18n($t("devTeam.menuManage.catalog.form.validation.selectGroupType")),
			trigger: "change",
		},
	],
	storeType: [
		{
			required: true,
			message: transformI18n($t("devTeam.menuManage.catalog.form.validation.selectStoreType")),
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
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
