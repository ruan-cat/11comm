<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { CommunityConfigurationFormProps } from "./form";
import type { SettingCommunityConfigFormVO } from "@01s-11comm/type";
import { communityConfigStatusOptions, settingTypeOptions } from "@01s-11comm/type";
import { cloneDeep } from "@pureadmin/utils";

const props = defineProps<CommunityConfigurationFormProps>();

function translateFromRecord(record: Record<string, string>, value?: string | null) {
	if (!value) {
		return "";
	}
	return record[value] ?? value;
}

const settingTypeTextMap = computed(() => ({
	系统设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.system")),
	业务设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.business")),
	界面设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.ui")),
	功能设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.feature")),
	安全设置: transformI18n($t("settingManage.systemManage.communityConfiguration.options.settingTypes.security")),
}));

const statusTextMap = computed(() => ({
	启用: transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.enabled")),
	禁用: transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.disabled")),
	待审核: transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.pending")),
}));

function translateSettingTypeLabel(value?: string | null) {
	return translateFromRecord(settingTypeTextMap.value, value);
}

function translateStatusLabel(value?: string | null) {
	return translateFromRecord(statusTextMap.value, value);
}

const defaultValues = props.defaultValues as FieldValues & SettingCommunityConfigFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & SettingCommunityConfigFormVO);
const formComputed = computed(() => form.value);

const translatedSettingTypeOptions = computed(() =>
	settingTypeOptions.map((item) => ({
		...item,
		label: translateSettingTypeLabel(String(item.value)),
	})),
);

const translatedCommunityStatusOptions = computed(() =>
	communityConfigStatusOptions.map((item) => ({
		...item,
		label: translateStatusLabel(String(item.label)),
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.communityName")),
		prop: "communityName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingName")),
		prop: "settingName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingValue")),
		prop: "settingValue",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingType")),
		prop: "settingType",
		valueType: "select",
		options: translatedSettingTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.dataStatus")),
		prop: "statusCd",
		valueType: "select",
		options: translatedCommunityStatusOptions.value,
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			rows: 3,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	communityName: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.communityConfiguration.validation.communityNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("settingManage.systemManage.communityConfiguration.validation.communityNameLength")),
			trigger: "blur",
		},
	],
	settingName: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.communityConfiguration.validation.settingNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: transformI18n($t("settingManage.systemManage.communityConfiguration.validation.settingNameLength")),
			trigger: "blur",
		},
	],
	settingValue: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.communityConfiguration.validation.settingValueRequired")),
			trigger: "blur",
		},
		{
			min: 1,
			max: 200,
			message: transformI18n($t("settingManage.systemManage.communityConfiguration.validation.settingValueLength")),
			trigger: "blur",
		},
	],
	settingType: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.communityConfiguration.validation.settingTypeRequired")),
			trigger: "change",
		},
	],
	statusCd: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.communityConfiguration.validation.dataStatusRequired")),
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
