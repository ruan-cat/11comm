<script lang="ts" setup>
import { cloneDeep } from "@pureadmin/utils";
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { WorkingScheduleFormProps } from "./form";
import { scheduleTypeOptions, weekdayOptions, type WorkingScheduleFormVO } from "@01s-11comm/type";

const props = defineProps<WorkingScheduleFormProps>();
const { locale } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & WorkingScheduleFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & WorkingScheduleFormVO);
const formComputed = computed(() => form.value);

const translatedScheduleTypeOptions = computed(() =>
	scheduleTypeOptions.map((option) => ({
		...option,
		label: transformI18n(
			$t(
				`settingManage.organizeManage.workingSchedule.options.${option.value === "full_day" ? "allDay" : option.value}`,
			),
		),
	})),
);

const weekdayKeyMap = {
	1: "monday",
	2: "tuesday",
	3: "wednesday",
	4: "thursday",
	5: "friday",
	6: "saturday",
	7: "sunday",
} as const;

const translatedWeekdayOptions = computed(() =>
	weekdayOptions.map((option) => ({
		...option,
		label: transformI18n(
			$t(
				`settingManage.organizeManage.workingSchedule.options.${weekdayKeyMap[Number(option.value) as keyof typeof weekdayKeyMap]}`,
			),
		),
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.name")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.type")),
		prop: "type",
		valueType: "select",
		options: translatedScheduleTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.type")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.startTime")),
		prop: "startTime",
		valueType: "time-picker",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.startTime")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.endTime")),
		prop: "endTime",
		valueType: "time-picker",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.endTime")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.weekday")),
		prop: "weekday",
		valueType: "select",
		options: translatedWeekdayOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.weekday")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.managerName")),
		prop: "managerName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.managerName")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.phone")),
		prop: "phone",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.phone")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			placeholder: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.description")),
		},
	},
	{
		label: transformI18n($t("settingManage.organizeManage.workingSchedule.fields.enabled")),
		prop: "enabled",
		valueType: "switch",
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.workingSchedule.form.validation.enterName")),
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.workingSchedule.form.validation.selectType")),
			trigger: "change",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.workingSchedule.form.validation.selectStartTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.workingSchedule.form.validation.selectEndTime")),
			trigger: "change",
		},
	],
	weekday: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.workingSchedule.form.validation.selectWeekday")),
			trigger: "change",
		},
	],
	managerName: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.workingSchedule.form.validation.enterManagerName")),
			trigger: "blur",
		},
	],
	phone: [
		{
			required: true,
			message: transformI18n($t("settingManage.organizeManage.workingSchedule.form.validation.enterPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("settingManage.organizeManage.workingSchedule.form.validation.invalidPhone")),
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
