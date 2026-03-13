<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { booleanOptions, menuItemStatusOptions, menuTypeOptions, type MenuItemFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type MenuItemFormProps } from "./form";

const props = defineProps<MenuItemFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & MenuItemFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & MenuItemFormVO);
const formComputed = computed(() => form.value);

const parentMenuOptions = withLocale(() => [
	{ label: renderI18n($t("devTeam.menuManage.item.form.parentMenus.root")), value: "根菜单" },
	{ label: renderI18n($t("devTeam.menuManage.item.form.parentMenus.systemManage")), value: "系统管理" },
	{ label: renderI18n($t("devTeam.menuManage.item.form.parentMenus.monitorManage")), value: "监控管理" },
	{ label: renderI18n($t("devTeam.menuManage.item.form.parentMenus.systemTool")), value: "系统工具" },
	{ label: renderI18n($t("devTeam.menuManage.item.form.parentMenus.logManage")), value: "日志管理" },
	{ label: renderI18n($t("devTeam.menuManage.item.form.parentMenus.systemSetting")), value: "系统设置" },
]);

const menuTypeLabelKeyMap = {
	catalog: $t("devTeam.menuManage.item.form.options.catalog"),
	menu: $t("devTeam.menuManage.item.form.options.menu"),
	button: $t("devTeam.menuManage.item.form.options.button"),
} as const;

const statusLabelKeyMap = {
	enabled: $t("devTeam.menuManage.item.form.options.enabled"),
	disabled: $t("devTeam.menuManage.item.form.options.disabled"),
} as const;

const booleanLabelKeyMap = {
	true: $t("devTeam.menuManage.item.form.options.yes"),
	false: $t("devTeam.menuManage.item.form.options.no"),
} as const;

function translateMenuType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = menuTypeLabelKeyMap[value as keyof typeof menuTypeLabelKeyMap];
	return key ? renderI18n(key) : value;
}

function translateStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? renderI18n(key) : value;
}

function translateBoolean(value?: string | number | boolean | null) {
	if (value === null || value === undefined) {
		return "";
	}

	const key = booleanLabelKeyMap[String(value) as keyof typeof booleanLabelKeyMap];
	return key ? renderI18n(key) : String(value);
}

const translatedMenuTypeOptions = withLocale(() =>
	menuTypeOptions.map((option) => ({
		...option,
		label: translateMenuType(String(option.value)),
	})),
);

const translatedStatusOptions = withLocale(() =>
	menuItemStatusOptions.map((option) => ({
		...option,
		label: translateStatus(String(option.value)),
	})),
);

const translatedBooleanOptions = withLocale(() =>
	booleanOptions.map((option) => ({
		...option,
		label: translateBoolean(option.value),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.menuName")),
		prop: "menuName",
		valueType: "input",
		required: true,
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.menuName")),
			clearable: true,
		},
		width: "200px",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.parentMenu")),
		prop: "parentMenu",
		valueType: "select",
		required: true,
		options: parentMenuOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.parentMenu")),
			clearable: true,
		},
		width: "200px",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.menuType")),
		prop: "menuType",
		valueType: "select",
		required: true,
		options: translatedMenuTypeOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.menuType")),
			clearable: true,
		},
		width: "150px",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.icon")),
		prop: "icon",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.icon")),
			clearable: true,
		},
		width: "200px",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.routePath")),
		prop: "routePath",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.routePath")),
			clearable: true,
		},
		width: "250px",
		hidden: (formData) => formData.menuType === "button",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.componentPath")),
		prop: "componentPath",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.componentPath")),
			clearable: true,
		},
		width: "250px",
		hidden: (formData) => ["button", "catalog"].includes(String(formData.menuType)),
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.permissionKey")),
		prop: "permissionKey",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.permissionKey")),
			clearable: true,
		},
		width: "250px",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.sortNo")),
		prop: "sortNo",
		valueType: "input-number",
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.sortNo")),
			min: 1,
			max: 999,
		},
		width: "150px",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.status")),
		prop: "status",
		valueType: "select",
		required: true,
		options: translatedStatusOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.status")),
			clearable: true,
		},
		width: "150px",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.isExternal")),
		prop: "isExternal",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.isExternal")),
			clearable: true,
		},
		width: "150px",
		hidden: (formData) => formData.menuType === "button",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.isCached")),
		prop: "isCached",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.isCached")),
			clearable: true,
		},
		width: "150px",
		hidden: (formData) => ["button", "catalog"].includes(String(formData.menuType)),
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.isHidden")),
		prop: "isHidden",
		valueType: "select",
		options: translatedBooleanOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.isHidden")),
			clearable: true,
		},
		width: "150px",
	},
	{
		label: renderI18n($t("devTeam.menuManage.item.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			placeholder: renderI18n($t("devTeam.menuManage.item.form.placeholders.description")),
			clearable: true,
			rows: 3,
		},
		width: "100%",
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	menuName: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.enterMenuName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.menuNameLength")),
			trigger: "blur",
		},
	],
	parentMenu: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.selectParentMenu")),
			trigger: "change",
		},
	],
	menuType: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.selectMenuType")),
			trigger: "change",
		},
	],
	routePath: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.enterRoutePath")),
			trigger: "blur",
		},
		{
			pattern: /^\/[a-zA-Z0-9/-]*$/,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.routePathPattern")),
			trigger: "blur",
		},
	],
	componentPath: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.enterComponentPath")),
			trigger: "blur",
		},
		{
			pattern: /^\/[a-zA-Z0-9/-]*$/,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.componentPathPattern")),
			trigger: "blur",
		},
	],
	permissionKey: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.enterPermissionKey")),
			trigger: "blur",
		},
		{
			pattern: /^[a-zA-Z0-9:_-]+$/,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.permissionKeyPattern")),
			trigger: "blur",
		},
	],
	sortNo: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.enterSortNo")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			max: 999,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.sortNoRange")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.item.form.validation.selectStatus")),
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
