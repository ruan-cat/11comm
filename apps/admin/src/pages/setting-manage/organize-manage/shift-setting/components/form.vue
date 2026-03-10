<!--
  班次设置表单
  用于新增 修改班次设置
-->
<script lang="ts" setup>
import { useTemplateRef, computed, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

import { type ShiftSettingFormProps } from "./form";
import { type ShiftSettingFormVO, shiftTypeOptions } from "@01s-11comm/type";

const props = defineProps<ShiftSettingFormProps & { mode: Mode }>();
const { t } = useI18n();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ShiftSettingFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = cloneDeep(props.form) as FieldValues & ShiftSettingFormVO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(toRefForm);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedShiftTypeOptions = computed(() => {
	const shiftTypeKeyMap: Record<string, string> = {
		白班: "day",
		夜班: "night",
		中班: "middle",
		全天: "allDay",
	};

	return shiftTypeOptions.map((option) => ({
		...option,
		label: transformI18n(
			t(`settingManage.organizeManage.shiftSetting.form.options.type.${shiftTypeKeyMap[String(option.value)]}`),
		),
	}));
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.name")),
		prop: "name",
		valueType: "input",
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.type")),
		prop: "type",
		valueType: "select",
		options: translatedShiftTypeOptions.value,
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.startTime")),
		prop: "startTime",
		valueType: "time-picker",
		required: true,
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.endTime")),
		prop: "endTime",
		valueType: "time-picker",
		required: true,
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.enabled")),
		prop: "enabled",
		valueType: "switch",
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.shiftSetting.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
]);

// 表单验证规则
const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.shiftSetting.form.validation.enterName")),
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.shiftSetting.form.validation.selectType")),
			trigger: "change",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.shiftSetting.form.validation.selectStartTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.shiftSetting.form.validation.selectEndTime")),
			trigger: "change",
		},
	],
}));

// 对外导出表单实例和表单对象
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
