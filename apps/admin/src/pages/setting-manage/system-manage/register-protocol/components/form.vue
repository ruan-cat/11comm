<script lang="ts" setup>
import { cloneDeep } from "@pureadmin/utils";
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { smRegisterProtocolStatusOptions } from "@01s-11comm/type";
import type { RegisterProtocolFormData, RegisterProtocolFormProps } from "./form";

const props = defineProps<RegisterProtocolFormProps>();
const { locale } = useI18nConfig();

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

function translateStatusLabel(value?: string | null) {
	if (value === "enabled") {
		return transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.enabled"));
	}
	if (value === "disabled") {
		return transformI18n($t("settingManage.systemManage.communityConfiguration.options.statuses.disabled"));
	}
	return value || "";
}

const defaultValues = props.defaultValues as FieldValues & RegisterProtocolFormData;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/** cloneDeep 初始化弹窗表单，避免 PlusForm 编辑过程直接污染列表行或 defaultValues。 */
const form = ref(cloneDeep(props.form) as FieldValues & RegisterProtocolFormData);
/** 暴露给弹窗关闭前比较和 CUD payload 读取，保持和 PlusForm 当前值同步。 */
const formComputed = computed(() => form.value);

/** 正式接口保存 enabled/disabled，选项只负责展示翻译后的状态文案。 */
const translatedStatusOptions = computed(() =>
	smRegisterProtocolStatusOptions.map((item) => ({
		...item,
		label: translateStatusLabel(String(item.value)),
	})),
);

/** 表单列配置依赖 locale 与 mode 重新计算，确保切换语言和只读详情弹窗时同步刷新。 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolType")),
		prop: "protocolType",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			maxlength: 50,
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolName")),
		prop: "protocolTitle",
		valueType: "input",
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			maxlength: 200,
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolVersion")),
		prop: "version",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			maxlength: 20,
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.registerProtocol.fields.status")),
		prop: "status",
		valueType: "select",
		required: true,
		options: translatedStatusOptions.value,
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolContent")),
		prop: "protocolContent",
		valueType: "textarea",
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			rows: 12,
		},
	},
]);

/** 校验文案在 computed 内生成，避免语言切换后仍保留旧 locale 的提示。 */
const plusFormRules = computed<PlusFormRules>(() => {
	const titleLabel = transformI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolName"));
	const contentLabel = transformI18n($t("operationTeam.systemManage.registerProtocol.fields.protocolContent"));
	const statusLabel = transformI18n($t("operationTeam.systemManage.registerProtocol.fields.status"));

	return {
		protocolTitle: [
			{ required: true, message: createRequiredMessage(titleLabel), trigger: "blur" },
			{ min: 1, max: 200, message: createLengthMessage(titleLabel, 1, 200), trigger: "blur" },
		],
		protocolContent: [{ required: true, message: createRequiredMessage(contentLabel), trigger: "blur" }],
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
