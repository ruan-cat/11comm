<!--
  菜单组表单
  用于新增/修改菜单组
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { MenuGroupFormVO } from "@01s-11comm/type";
import { groupTypeOptions, storeOptions, iconOptions, menuGroupStatusOptions } from "@01s-11comm/type";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

import { MenuGroupFormProps, defaultForm } from "./form";

const props = defineProps<MenuGroupFormProps>();
const { t } = useI18n();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & MenuGroupFormVO;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = cloneDeep(props.form) as FieldValues & MenuGroupFormVO;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

const translatedGroupTypeOptions = computed(() =>
	groupTypeOptions.map((option) => ({
		...option,
		label: transformI18n(t(`devTeam.menuManage.group.form.options.groupTypes.${option.value}`)),
	})),
);

const translatedStoreOptions = computed(() => {
	const storeKeyMap: Record<string, string> = {
		系统默认: "systemDefault",
		万科物业: "vanke",
		碧桂园服务: "countryGarden",
		恒大物业: "evergrande",
		绿城服务: "greentown",
		保利物业: "poly",
		龙湖物业: "longfor",
		中海物业: "cohl",
		华润置地: "chinaResources",
		招商积余: "cmhk",
	};

	return storeOptions.map((option) => ({
		...option,
		label: transformI18n(t(`devTeam.menuManage.group.form.options.stores.${storeKeyMap[option.value]}`)),
	}));
});

const translatedIconOptions = computed(() => {
	const iconKeyMap: Record<string, string> = {
		"mdi:menu": "menu",
		"mdi:cog": "setting",
		"mdi:account": "user",
		"mdi:home": "home",
		"mdi:dashboard": "dashboard",
		"mdi:file": "file",
		"mdi:chart-bar": "chart",
		"mdi:file-chart": "report",
		"mdi:server": "system",
		"mdi:shield": "security",
		"mdi:monitor": "monitor",
		"mdi:clipboard-text": "log",
		"mdi:key": "permission",
		"mdi:account-group": "role",
		"mdi:domain": "department",
		"mdi:database": "data",
		"mdi:settings": "config",
		"mdi:tools": "tool",
		"mdi:help-circle": "help",
		"mdi:bell": "notice",
	};

	return iconOptions.map((option) => ({
		...option,
		label: transformI18n(t(`devTeam.menuManage.group.form.options.icons.${iconKeyMap[option.value]}`)),
	}));
});

const translatedStatusOptions = computed(() => {
	const statusKeyMap: Record<string, string> = {
		enabled: "enabled",
		disabled: "disabled",
		启用: "enabled",
		禁用: "disabled",
	};

	return menuGroupStatusOptions.map((option) => ({
		...option,
		label: transformI18n(t(`devTeam.menuManage.group.form.options.status.${statusKeyMap[String(option.value)]}`)),
	}));
});

/** 表单项配置 Form columns configuration */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n(t("devTeam.menuManage.group.fields.groupId")),
		prop: "groupId",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(t("devTeam.menuManage.group.form.placeholders.groupId")),
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.group.fields.groupName")),
		prop: "groupName",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(t("devTeam.menuManage.group.form.placeholders.groupName")),
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.group.fields.groupCode")),
		prop: "groupCode",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(t("devTeam.menuManage.group.form.placeholders.groupCode")),
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.group.form.fields.groupType")),
		prop: "groupType",
		valueType: "select",
		width: "180px",
		required: true,
		options: translatedGroupTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n(t("devTeam.menuManage.group.form.placeholders.groupType")),
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.group.form.fields.storeName")),
		prop: "storeName",
		valueType: "select",
		width: "180px",
		required: true,
		options: translatedStoreOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n(t("devTeam.menuManage.group.form.placeholders.storeName")),
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.group.fields.sortNo")),
		prop: "sortNo",
		valueType: "input-number",
		width: "150px",
		required: true,
		fieldProps: {
			min: 1,
			max: 9999,
			placeholder: transformI18n(t("devTeam.menuManage.group.form.placeholders.sortNo")),
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.group.form.fields.icon")),
		prop: "icon",
		valueType: "select",
		width: "200px",
		required: true,
		options: translatedIconOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n(t("devTeam.menuManage.group.form.placeholders.icon")),
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.group.fields.status")),
		prop: "status",
		valueType: "select",
		width: "150px",
		required: true,
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(t("devTeam.menuManage.group.form.placeholders.status")),
		},
	},
	{
		label: transformI18n(t("devTeam.menuManage.group.fields.description")),
		prop: "description",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(t("devTeam.menuManage.group.form.placeholders.description")),
			rows: 3,
			maxlength: 200,
			showWordLimit: true,
		},
	},
]);

/** 表单校验规则 Form validation rules */
const plusFormRules = computed<PlusFormRules>(() => ({
	groupId: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.enterGroupId")),
			trigger: "blur",
		},
		{
			min: 3,
			max: 20,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.groupIdLength")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Z0-9_]+$/,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.groupIdPattern")),
			trigger: "blur",
		},
	],
	groupName: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.enterGroupName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.groupNameLength")),
			trigger: "blur",
		},
	],
	groupCode: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.enterGroupCode")),
			trigger: "blur",
		},
		{
			min: 3,
			max: 50,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.groupCodeLength")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Z_]+$/,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.groupCodePattern")),
			trigger: "blur",
		},
	],
	groupType: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.selectGroupType")),
			trigger: "change",
		},
	],
	storeName: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.selectStoreName")),
			trigger: "change",
		},
	],
	sortNo: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.enterSortNo")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			max: 9999,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.sortNoRange")),
			trigger: "blur",
		},
	],
	icon: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.selectIcon")),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.group.form.validation.selectStatus")),
			trigger: "change",
		},
	],
	description: [
		{ max: 200, message: transformI18n(t("devTeam.menuManage.group.form.validation.descriptionMax")), trigger: "blur" },
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
