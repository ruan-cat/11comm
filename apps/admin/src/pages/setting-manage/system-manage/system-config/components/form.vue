<script lang="ts" setup>
import { cloneDeep } from "@pureadmin/utils";
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import type { SystemConfigFormData, SystemConfigFormProps } from "./form";

const props = defineProps<SystemConfigFormProps>();

const defaultValues = props.defaultValues as FieldValues & SystemConfigFormData;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/** cloneDeep 初始化弹窗表单，避免 PlusForm 编辑过程直接污染列表行或 defaultValues。 */
const form = ref(cloneDeep(props.form) as FieldValues & SystemConfigFormData);
/** 暴露给弹窗关闭前比较和 CUD payload 读取，保持和 PlusForm 当前值同步。 */
const formComputed = computed(() => form.value);

/** 表单校验文案暂沿用现有英文提示，只补充配置边界说明，不改变业务行为。 */
function createRequiredMessage(fieldLabel: string, select = false) {
	return `${select ? "Please select" : "Please enter"} ${fieldLabel}`;
}

function createLengthMessage(fieldLabel: string, min: number, max: number) {
	return `${fieldLabel} length must be between ${min} and ${max} characters`;
}

/** 正式接口保存 configType 原始枚举值，选项只负责展示翻译后的类型文案。 */
const translatedConfigTypeOptions = computed(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.text")),
		value: "text",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.number")),
		value: "number",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.boolean")),
		value: "boolean",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.json")),
		value: "json",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.configTypes.url")),
		value: "url",
	},
]);

const translatedStatusOptions = computed(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.enabled")),
		value: "enabled",
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.options.statuses.disabled")),
		value: "disabled",
	},
]);

/** 表单列配置依赖 locale 与 mode 重新计算，确保切换语言和只读详情弹窗时同步刷新。 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configKey")),
		prop: "configKey",
		valueType: "input",
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.configKey")),
			maxlength: 100,
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configValue")),
		prop: "configValue",
		valueType: "textarea",
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.configValue")),
			rows: 3,
			maxlength: 1000,
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.configType")),
		prop: "configType",
		valueType: "select",
		required: true,
		options: translatedConfigTypeOptions.value,
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.configType")),
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.description")),
		prop: "configDescription",
		valueType: "textarea",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.description")),
			rows: 3,
			maxlength: 200,
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.systemConfig.fields.status")),
		prop: "status",
		valueType: "select",
		required: true,
		options: translatedStatusOptions.value,
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			placeholder: transformI18n($t("operationTeam.systemManage.systemConfig.placeholders.status")),
		},
	},
]);

/** 校验规则字段需与 SystemConfigFormData 保持一致，提交时直接作为 CUD payload。 */
const plusFormRules = computed<PlusFormRules>(() => {
	const configKeyLabel = transformI18n($t("operationTeam.systemManage.systemConfig.fields.configKey"));
	const configValueLabel = transformI18n($t("operationTeam.systemManage.systemConfig.fields.configValue"));
	const configTypeLabel = transformI18n($t("operationTeam.systemManage.systemConfig.fields.configType"));
	const statusLabel = transformI18n($t("operationTeam.systemManage.systemConfig.fields.status"));
	const configDescriptionLabel = transformI18n($t("operationTeam.systemManage.systemConfig.fields.description"));

	return {
		configKey: [
			{ required: true, message: createRequiredMessage(configKeyLabel), trigger: "blur" },
			{ min: 1, max: 100, message: createLengthMessage(configKeyLabel, 1, 100), trigger: "blur" },
		],
		configValue: [
			{ required: true, message: createRequiredMessage(configValueLabel), trigger: "blur" },
			{ min: 1, max: 1000, message: createLengthMessage(configValueLabel, 1, 1000), trigger: "blur" },
		],
		configType: [{ required: true, message: createRequiredMessage(configTypeLabel, true), trigger: "change" }],
		configDescription: [{ max: 200, message: createLengthMessage(configDescriptionLabel, 0, 200), trigger: "blur" }],
		status: [{ required: true, message: createRequiredMessage(statusLabel, true), trigger: "change" }],
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
