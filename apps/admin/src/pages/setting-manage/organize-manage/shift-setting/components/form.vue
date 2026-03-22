<!--
  班次设置表单
  用于新增/修改班次设置
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { shiftTypeOptions, type ShiftSettingFormVO } from "@01s-11comm/type";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { type ShiftSettingFormProps } from "./form";

const props = defineProps<ShiftSettingFormProps>();
const { locale } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & ShiftSettingFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & ShiftSettingFormVO);
const formComputed = computed(() => form.value);

const shiftTypeKeyMap = {
	白班: "day",
	夜班: "night",
	中班: "middle",
	全天: "allDay",
	day: "day",
	night: "night",
	middle: "middle",
	allDay: "allDay",
} as const;

const translatedShiftTypeOptions = computed(() =>
	shiftTypeOptions.map((option) => ({
		...option,
		label: transformI18n(
			$t(
				`settingManage.organizeManage.shiftSetting.form.options.type.${shiftTypeKeyMap[String(option.value) as keyof typeof shiftTypeKeyMap]}`,
			),
		),
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.name")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.type")),
		prop: "type",
		valueType: "select",
		options: translatedShiftTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.type")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.startTime")),
		prop: "startTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
			placeholder: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.startTime")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.endTime")),
		prop: "endTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
			placeholder: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.endTime")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.enabled")),
		prop: "enabled",
		valueType: "switch",
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.shiftSetting.fields.description")),
			disabled: props.mode === "info",
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.shiftSetting.form.validation.enterName")),
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.shiftSetting.form.validation.selectType")),
			trigger: "change",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.shiftSetting.form.validation.selectStartTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.shiftSetting.form.validation.selectEndTime")),
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
