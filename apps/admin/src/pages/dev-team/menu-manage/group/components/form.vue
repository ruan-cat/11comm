<!--
  菜单组表单
  用于新增/修改菜单组
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import {
	groupTypeOptions,
	iconOptions,
	menuGroupStatusOptions,
	storeOptions,
	type MenuGroupFormVO,
} from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { MenuGroupFormProps } from "./form";

const props = defineProps<MenuGroupFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & MenuGroupFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & MenuGroupFormVO);
const formComputed = computed(() => form.value);

const groupTypeLabelKeyMap = {
	system: $t("devTeam.menuManage.group.form.options.groupTypes.system"),
	merchant: $t("devTeam.menuManage.group.form.options.groupTypes.merchant"),
	custom: $t("devTeam.menuManage.group.form.options.groupTypes.custom"),
	temp: $t("devTeam.menuManage.group.form.options.groupTypes.temp"),
} as const;

const storeLabelKeyMap = {
	系统默认: $t("devTeam.menuManage.group.form.options.stores.systemDefault"),
	万科物业: $t("devTeam.menuManage.group.form.options.stores.vanke"),
	碧桂园服务: $t("devTeam.menuManage.group.form.options.stores.countryGarden"),
	恒大物业: $t("devTeam.menuManage.group.form.options.stores.evergrande"),
	绿城服务: $t("devTeam.menuManage.group.form.options.stores.greentown"),
	保利物业: $t("devTeam.menuManage.group.form.options.stores.poly"),
	龙湖物业: $t("devTeam.menuManage.group.form.options.stores.longfor"),
	中海物业: $t("devTeam.menuManage.group.form.options.stores.cohl"),
	华润置地: $t("devTeam.menuManage.group.form.options.stores.chinaResources"),
	招商积余: $t("devTeam.menuManage.group.form.options.stores.cmhk"),
} as const;

const iconLabelKeyMap = {
	"mdi:menu": $t("devTeam.menuManage.group.form.options.icons.menu"),
	"mdi:cog": $t("devTeam.menuManage.group.form.options.icons.setting"),
	"mdi:account": $t("devTeam.menuManage.group.form.options.icons.user"),
	"mdi:home": $t("devTeam.menuManage.group.form.options.icons.home"),
	"mdi:dashboard": $t("devTeam.menuManage.group.form.options.icons.dashboard"),
	"mdi:file": $t("devTeam.menuManage.group.form.options.icons.file"),
	"mdi:chart-bar": $t("devTeam.menuManage.group.form.options.icons.chart"),
	"mdi:file-chart": $t("devTeam.menuManage.group.form.options.icons.report"),
	"mdi:server": $t("devTeam.menuManage.group.form.options.icons.system"),
	"mdi:shield": $t("devTeam.menuManage.group.form.options.icons.security"),
	"mdi:monitor": $t("devTeam.menuManage.group.form.options.icons.monitor"),
	"mdi:clipboard-text": $t("devTeam.menuManage.group.form.options.icons.log"),
	"mdi:key": $t("devTeam.menuManage.group.form.options.icons.permission"),
	"mdi:account-group": $t("devTeam.menuManage.group.form.options.icons.role"),
	"mdi:domain": $t("devTeam.menuManage.group.form.options.icons.department"),
	"mdi:database": $t("devTeam.menuManage.group.form.options.icons.data"),
	"mdi:settings": $t("devTeam.menuManage.group.form.options.icons.config"),
	"mdi:tools": $t("devTeam.menuManage.group.form.options.icons.tool"),
	"mdi:help-circle": $t("devTeam.menuManage.group.form.options.icons.help"),
	"mdi:bell": $t("devTeam.menuManage.group.form.options.icons.notice"),
} as const;

const statusLabelKeyMap = {
	enabled: $t("devTeam.menuManage.group.form.options.status.enabled"),
	disabled: $t("devTeam.menuManage.group.form.options.status.disabled"),
	启用: $t("devTeam.menuManage.group.form.options.status.enabled"),
	禁用: $t("devTeam.menuManage.group.form.options.status.disabled"),
} as const;

function translateGroupType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = groupTypeLabelKeyMap[value as keyof typeof groupTypeLabelKeyMap];
	return key ? renderI18n(key) : value;
}

function translateStore(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = storeLabelKeyMap[value as keyof typeof storeLabelKeyMap];
	return key ? renderI18n(key) : value;
}

function translateIcon(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = iconLabelKeyMap[value as keyof typeof iconLabelKeyMap];
	return key ? renderI18n(key) : value;
}

function translateStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelKeyMap[value as keyof typeof statusLabelKeyMap];
	return key ? renderI18n(key) : value;
}

const translatedGroupTypeOptions = withLocale(() =>
	groupTypeOptions.map((option) => ({
		...option,
		label: translateGroupType(String(option.value)),
	})),
);

const translatedStoreOptions = withLocale(() =>
	storeOptions.map((option) => ({
		...option,
		label: translateStore(String(option.value)),
	})),
);

const translatedIconOptions = withLocale(() =>
	iconOptions.map((option) => ({
		...option,
		label: translateIcon(String(option.value)),
	})),
);

const translatedStatusOptions = withLocale(() =>
	menuGroupStatusOptions.map((option) => ({
		...option,
		label: translateStatus(String(option.value)),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("devTeam.menuManage.group.fields.groupId")),
		prop: "groupId",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("devTeam.menuManage.group.form.placeholders.groupId")),
		},
	},
	{
		label: renderI18n($t("devTeam.menuManage.group.fields.groupName")),
		prop: "groupName",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("devTeam.menuManage.group.form.placeholders.groupName")),
		},
	},
	{
		label: renderI18n($t("devTeam.menuManage.group.fields.groupCode")),
		prop: "groupCode",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("devTeam.menuManage.group.form.placeholders.groupCode")),
		},
	},
	{
		label: renderI18n($t("devTeam.menuManage.group.form.fields.groupType")),
		prop: "groupType",
		valueType: "select",
		width: "180px",
		required: true,
		options: translatedGroupTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: renderI18n($t("devTeam.menuManage.group.form.placeholders.groupType")),
		},
	},
	{
		label: renderI18n($t("devTeam.menuManage.group.form.fields.storeName")),
		prop: "storeName",
		valueType: "select",
		width: "180px",
		required: true,
		options: translatedStoreOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: renderI18n($t("devTeam.menuManage.group.form.placeholders.storeName")),
		},
	},
	{
		label: renderI18n($t("devTeam.menuManage.group.fields.sortNo")),
		prop: "sortNo",
		valueType: "input-number",
		width: "150px",
		required: true,
		fieldProps: {
			min: 1,
			max: 9999,
			placeholder: renderI18n($t("devTeam.menuManage.group.form.placeholders.sortNo")),
		},
	},
	{
		label: renderI18n($t("devTeam.menuManage.group.form.fields.icon")),
		prop: "icon",
		valueType: "select",
		width: "200px",
		required: true,
		options: translatedIconOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: renderI18n($t("devTeam.menuManage.group.form.placeholders.icon")),
		},
	},
	{
		label: renderI18n($t("devTeam.menuManage.group.fields.status")),
		prop: "status",
		valueType: "select",
		width: "150px",
		required: true,
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("devTeam.menuManage.group.form.placeholders.status")),
		},
	},
	{
		label: renderI18n($t("devTeam.menuManage.group.fields.description")),
		prop: "description",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("devTeam.menuManage.group.form.placeholders.description")),
			rows: 3,
			maxlength: 200,
			showWordLimit: true,
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	groupId: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.enterGroupId")),
			trigger: "blur",
		},
		{
			min: 3,
			max: 20,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.groupIdLength")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Z0-9_]+$/,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.groupIdPattern")),
			trigger: "blur",
		},
	],
	groupName: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.enterGroupName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.groupNameLength")),
			trigger: "blur",
		},
	],
	groupCode: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.enterGroupCode")),
			trigger: "blur",
		},
		{
			min: 3,
			max: 50,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.groupCodeLength")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Z_]+$/,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.groupCodePattern")),
			trigger: "blur",
		},
	],
	groupType: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.selectGroupType")),
			trigger: "change",
		},
	],
	storeName: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.selectStoreName")),
			trigger: "change",
		},
	],
	sortNo: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.enterSortNo")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			max: 9999,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.sortNoRange")),
			trigger: "blur",
		},
	],
	icon: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.selectIcon")),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.selectStatus")),
			trigger: "change",
		},
	],
	description: [
		{
			max: 200,
			message: renderI18n($t("devTeam.menuManage.group.form.validation.descriptionMax")),
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
