<script lang="ts" setup>
import { cloneDeep } from "@pureadmin/utils";
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { CommunityConfigurationFormData, CommunityConfigurationFormProps } from "./form";
import { communityConfigStatusOptions, settingTypeOptions } from "@01s-11comm/type";

const props = defineProps<CommunityConfigurationFormProps>();
const { locale } = useI18nConfig();

/** 正式接口保留中文业务枚举值，翻译只发生在选项 label 和表格展示层。 */
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

function createRequiredMessage(fieldLabel: string, select = false) {
	return locale.value === "en"
		? `${select ? "Please select " : "Please enter "}${fieldLabel}`
		: `${select ? "请选择" : "请输入"}${fieldLabel}`;
}

function createLengthMessage(fieldLabel: string, min: number, max: number) {
	return locale.value === "en"
		? `${fieldLabel} length must be between ${min} and ${max} characters`
		: `${fieldLabel}长度应在 ${min} 到 ${max} 个字符之间`;
}

const defaultValues = props.defaultValues as FieldValues & CommunityConfigurationFormData;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/** cloneDeep 初始化弹窗表单，避免 PlusForm 编辑过程直接污染列表行或 defaultValues。 */
const form = ref(cloneDeep(props.form) as FieldValues & CommunityConfigurationFormData);
/** 暴露给弹窗关闭前比较和 CUD payload 读取，保持和 PlusForm 当前值同步。 */
const formComputed = computed(() => form.value);

/** 正式接口返回的是业务值，选项展示在这里翻译，提交时仍保留原始 value。 */
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

/** 表单列配置依赖 locale 与 mode 重新计算，确保切换语言和只读详情弹窗时同步刷新。 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configId")),
		prop: "csId",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.communityId")),
		prop: "communityId",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.communityName")),
		prop: "communityName",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingName")),
		prop: "settingName",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingValue")),
		prop: "settingValue",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingType")),
		prop: "settingType",
		valueType: "select",
		options: translatedSettingTypeOptions.value,
		fieldProps: {
			disabled: props.mode === "info",
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
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.operator")),
		prop: "operator",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.communityConfiguration.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			rows: 3,
		},
	},
]);

/** 校验文案在 computed 内生成，避免语言切换后仍保留旧 locale 的提示。 */
const plusFormRules = computed<PlusFormRules>(() => {
	const configIdLabel = transformI18n($t("operationTeam.systemManage.systemConfig.fields.configId"));
	const communityIdLabel = transformI18n($t("settingManage.systemManage.initializeCell.fields.communityId"));
	const communityNameLabel = transformI18n(
		$t("settingManage.systemManage.communityConfiguration.fields.communityName"),
	);
	const settingNameLabel = transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingName"));
	const settingTypeLabel = transformI18n($t("settingManage.systemManage.communityConfiguration.fields.settingType"));
	const statusLabel = transformI18n($t("settingManage.systemManage.communityConfiguration.fields.dataStatus"));

	return {
		csId: [
			{ required: true, message: createRequiredMessage(configIdLabel), trigger: "blur" },
			{ min: 1, max: 50, message: createLengthMessage(configIdLabel, 1, 50), trigger: "blur" },
		],
		communityId: [
			{ required: true, message: createRequiredMessage(communityIdLabel), trigger: "blur" },
			{ min: 1, max: 50, message: createLengthMessage(communityIdLabel, 1, 50), trigger: "blur" },
		],
		communityName: [
			{ required: true, message: createRequiredMessage(communityNameLabel), trigger: "blur" },
			{ min: 1, max: 100, message: createLengthMessage(communityNameLabel, 1, 100), trigger: "blur" },
		],
		settingName: [
			{ required: true, message: createRequiredMessage(settingNameLabel), trigger: "blur" },
			{ min: 1, max: 100, message: createLengthMessage(settingNameLabel, 1, 100), trigger: "blur" },
		],
		settingType: [{ required: true, message: createRequiredMessage(settingTypeLabel, true), trigger: "change" }],
		statusCd: [{ required: true, message: createRequiredMessage(statusLabel, true), trigger: "change" }],
	};
});

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
