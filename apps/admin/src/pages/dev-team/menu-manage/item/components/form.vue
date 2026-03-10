<!--
  菜单项表单
  用于新增、修改菜单项
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { MenuItemFormVO } from "@01s-11comm/type";
import { menuTypeOptions, menuItemStatusOptions, booleanOptions } from "@01s-11comm/type";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

import { MenuItemFormProps, defaultForm } from "./form";

const props = defineProps<MenuItemFormProps>();
const { t } = useI18n();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & MenuItemFormVO;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = cloneDeep(props.form) as FieldValues & MenuItemFormVO;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

/** 父级菜单选项 Parent menu options */
const parentMenuOptions = computed(() => [
	{ label: transformI18n(t("devTeam.menuManage.item.form.parentMenus.root")), value: "根菜单" },
	{ label: transformI18n(t("devTeam.menuManage.item.form.parentMenus.systemManage")), value: "系统管理" },
	{ label: transformI18n(t("devTeam.menuManage.item.form.parentMenus.monitorManage")), value: "监控管理" },
	{ label: transformI18n(t("devTeam.menuManage.item.form.parentMenus.systemTool")), value: "系统工具" },
	{ label: transformI18n(t("devTeam.menuManage.item.form.parentMenus.logManage")), value: "日志管理" },
	{ label: transformI18n(t("devTeam.menuManage.item.form.parentMenus.systemSetting")), value: "系统设置" },
]);

const translatedMenuTypeOptions = computed(() =>
	menuTypeOptions.map((option) => ({
		...option,
		label: transformI18n(t(`devTeam.menuManage.item.form.options.${option.value}`)),
	})),
);

const translatedStatusOptions = computed(() =>
	menuItemStatusOptions.map((option) => ({
		...option,
		label: transformI18n(t(`devTeam.menuManage.item.form.options.${option.value}`)),
	})),
);

const translatedBooleanOptions = computed(() => {
	const booleanKeyMap: Record<string, string> = {
		true: "yes",
		false: "no",
	};

	return booleanOptions.map((option) => ({
		...option,
		label: transformI18n(t(`devTeam.menuManage.item.form.options.${booleanKeyMap[String(option.value)]}`)),
	}));
});

/** 表单项配置 Form columns configuration */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.menuName")),
		prop: "menuName",
		valueType: "input",
		required: true,
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.menuName")),
			clearable: true,
		},
		width: "200px",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.parentMenu")),
		prop: "parentMenu",
		valueType: "select",
		required: true,
		options: parentMenuOptions.value,
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.parentMenu")),
			clearable: true,
		},
		width: "200px",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.menuType")),
		prop: "menuType",
		valueType: "select",
		required: true,
		options: translatedMenuTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.menuType")),
			clearable: true,
		},
		width: "150px",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.icon")),
		prop: "icon",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.icon")),
			clearable: true,
		},
		width: "200px",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.routePath")),
		prop: "routePath",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.routePath")),
			clearable: true,
		},
		width: "250px",
		hidden: (formData) => formData.menuType === "按钮" || formData.menuType === "接口",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.componentPath")),
		prop: "componentPath",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.componentPath")),
			clearable: true,
		},
		width: "250px",
		hidden: (formData) => formData.menuType === "按钮" || formData.menuType === "接口" || formData.menuType === "目录",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.permissionKey")),
		prop: "permissionKey",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.permissionKey")),
			clearable: true,
		},
		width: "250px",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.sortNo")),
		prop: "sortNo",
		valueType: "input-number",
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.sortNo")),
			min: 1,
			max: 999,
		},
		width: "150px",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.status")),
		prop: "status",
		valueType: "select",
		required: true,
		options: translatedStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.status")),
			clearable: true,
		},
		width: "150px",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.isExternal")),
		prop: "isExternal",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.isExternal")),
			clearable: true,
		},
		width: "150px",
		hidden: (formData) => formData.menuType === "按钮" || formData.menuType === "接口",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.isCached")),
		prop: "isCached",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.isCached")),
			clearable: true,
		},
		width: "150px",
		hidden: (formData) => formData.menuType === "按钮" || formData.menuType === "接口" || formData.menuType === "目录",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.isHidden")),
		prop: "isHidden",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.isHidden")),
			clearable: true,
		},
		width: "150px",
	},
	{
		label: transformI18n(t("devTeam.menuManage.item.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			placeholder: transformI18n(t("devTeam.menuManage.item.form.placeholders.description")),
			clearable: true,
			rows: 3,
		},
		width: "100%",
	},
]);

/** 表单校验规则 Form validation rules */
const plusFormRules = computed<PlusFormRules>(() => ({
	menuName: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.enterMenuName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.menuNameLength")),
			trigger: "blur",
		},
	],
	parentMenu: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.selectParentMenu")),
			trigger: "change",
		},
	],
	menuType: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.selectMenuType")),
			trigger: "change",
		},
	],
	routePath: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.enterRoutePath")),
			trigger: "blur",
		},
		{
			pattern: /^\/[a-zA-Z0-9/-]*$/,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.routePathPattern")),
			trigger: "blur",
		},
	],
	componentPath: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.enterComponentPath")),
			trigger: "blur",
		},
		{
			pattern: /^\/[a-zA-Z0-9/-]*$/,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.componentPathPattern")),
			trigger: "blur",
		},
	],
	permissionKey: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.enterPermissionKey")),
			trigger: "blur",
		},
		{
			pattern: /^[a-zA-Z0-9:_-]+$/,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.permissionKeyPattern")),
			trigger: "blur",
		},
	],
	sortNo: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.enterSortNo")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			max: 999,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.sortNoRange")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n(t("devTeam.menuManage.item.form.validation.selectStatus")),
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
