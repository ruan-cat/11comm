<script lang="ts" setup>
import { cloneDeep } from "@pureadmin/utils";
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { InitializeCellFormData, InitializeCommunityFormProps } from "./form";

const props = defineProps<InitializeCommunityFormProps>();
const { locale } = useI18nConfig();

function createRequiredMessage(fieldLabel: string) {
	return locale.value === "en" ? `Please enter ${fieldLabel}` : `请输入${fieldLabel}`;
}

function createLengthMessage(fieldLabel: string, min: number, max: number) {
	return locale.value === "en"
		? `${fieldLabel} length must be between ${min} and ${max} characters`
		: `${fieldLabel}长度应在 ${min} 到 ${max} 个字符之间`;
}

const defaultValues = props.defaultValues as FieldValues & InitializeCellFormData;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/** cloneDeep 初始化弹窗表单，避免 PlusForm 编辑过程直接污染列表行或 defaultValues。 */
const form = ref(cloneDeep(props.form) as FieldValues & InitializeCellFormData);
/** 暴露给弹窗关闭前比较和 CUD payload 读取，保持和 PlusForm 当前值同步。 */
const formComputed = computed(() => form.value);

/** 表单列配置依赖 locale 与 mode 重新计算，configParams 在表单内保持字符串编辑形态。 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.initItem")),
		prop: "initItem",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.initStatus")),
		prop: "initStatus",
		valueType: "input",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.configParams")),
		prop: "configParams",
		valueType: "textarea",
		fieldProps: {
			disabled: props.mode === "info",
			clearable: true,
			rows: 4,
		},
	},
]);

/** 校验文案在 computed 内生成，避免语言切换后仍保留旧 locale 的提示。 */
const plusFormRules = computed<PlusFormRules>(() => {
	const initItemLabel = transformI18n($t("settingManage.systemManage.initializeCell.fields.initItem"));

	return {
		initItem: [
			{ required: true, message: createRequiredMessage(initItemLabel), trigger: "blur" },
			{ min: 1, max: 100, message: createLengthMessage(initItemLabel, 1, 100), trigger: "blur" },
		],
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
