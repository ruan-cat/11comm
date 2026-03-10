<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { MenuCatalogFormData } from "@01s-11comm/type";
import { groupTypeOptions, storeTypeOptions } from "@01s-11comm/type";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

import { CatalogFormProps, defaultForm } from "./form";

/** 表单组件的 props Form component props */
const props = defineProps<CatalogFormProps>();
const { t } = useI18n();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & MenuCatalogFormData;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = structuredClone(props.form) as FieldValues & MenuCatalogFormData;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

const translatedGroupTypeOptions = computed(() =>
	groupTypeOptions.map((option) => ({
		...option,
		label: transformI18n(t(`devTeam.menuManage.catalog.form.options.${option.value}`)),
	})),
);

const translatedStoreTypeOptions = computed(() =>
	storeTypeOptions.map((option) => ({
		...option,
		label: transformI18n(
			t(`devTeam.menuManage.catalog.form.options.${option.value === "merchant" ? "merchantPlatform" : option.value}`),
		),
	})),
);

/** 表单项配置 Form columns configuration */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n(t("devTeam.menuManage.catalog.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.catalog.fields.icon")),
		prop: "icon",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.catalog.fields.label")),
		prop: "label",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.catalog.fields.seq")),
		prop: "seq",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			max: 999,
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.catalog.fields.groupType")),
		prop: "groupType",
		valueType: "select",
		options: translatedGroupTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.catalog.fields.storeType")),
		prop: "storeType",
		valueType: "select",
		options: translatedStoreTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.catalog.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			rows: 3,
		},
	},
]);

/** 表单校验规则 Form validation rules */
const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.catalog.form.validation.enterName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n(t("devTeam.menuManage.catalog.form.validation.nameLength")),
			trigger: "blur",
		},
	],
	icon: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.catalog.form.validation.enterIcon")),
			trigger: "blur",
		},
	],
	label: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.catalog.form.validation.enterLabel")),
			trigger: "blur",
		},
	],
	seq: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.catalog.form.validation.enterSeq")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 0,
			max: 999,
			message: transformI18n(t("devTeam.menuManage.catalog.form.validation.seqRange")),
			trigger: "blur",
		},
	],
	groupType: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.catalog.form.validation.selectGroupType")),
			trigger: "change",
		},
	],
	storeType: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.catalog.form.validation.selectStoreType")),
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
