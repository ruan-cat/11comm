<script lang="ts" setup>
import { useTemplateRef, reactive, ref, computed } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

import { WorkingScheduleFormProps } from "./form";
import { scheduleTypeOptions, weekdayOptions, type WorkingScheduleFormVO } from "@01s-11comm/type";

const props = defineProps<WorkingScheduleFormProps>();
const { t } = useI18n();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & WorkingScheduleFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & WorkingScheduleFormVO;

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

const translatedScheduleTypeOptions = computed(() =>
	scheduleTypeOptions.map((option) => ({
		...option,
		label: transformI18n(
			t(
				`settingManage.organizeManage.workingSchedule.options.${option.value === "full_day" ? "allDay" : option.value}`,
			),
		),
	})),
);

const translatedWeekdayOptions = computed(() => {
	const weekdayKeyMap: Record<number, string> = {
		1: "monday",
		2: "tuesday",
		3: "wednesday",
		4: "thursday",
		5: "friday",
		6: "saturday",
		7: "sunday",
	};

	return weekdayOptions.map((option) => ({
		...option,
		label: transformI18n(
			t(`settingManage.organizeManage.workingSchedule.options.${weekdayKeyMap[Number(option.value)]}`),
		),
	}));
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n(t("settingManage.organizeManage.workingSchedule.fields.name")),
		prop: "name",
		valueType: "input",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.workingSchedule.fields.type")),
		prop: "type",
		valueType: "select",
		options: translatedScheduleTypeOptions.value,
	},
	{
		label: transformI18n(t("settingManage.organizeManage.workingSchedule.fields.startTime")),
		prop: "startTime",
		valueType: "time-picker",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.workingSchedule.fields.endTime")),
		prop: "endTime",
		valueType: "time-picker",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.workingSchedule.fields.weekday")),
		prop: "weekday",
		valueType: "select",
		options: translatedWeekdayOptions.value,
	},
	{
		label: transformI18n(t("settingManage.organizeManage.workingSchedule.fields.managerName")),
		prop: "managerName",
		valueType: "input",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.workingSchedule.fields.phone")),
		prop: "phone",
		valueType: "input",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.workingSchedule.fields.description")),
		prop: "description",
		valueType: "textarea",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.workingSchedule.fields.enabled")),
		prop: "enabled",
		valueType: "switch",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.workingSchedule.form.validation.enterName")),
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.workingSchedule.form.validation.selectType")),
			trigger: "change",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.workingSchedule.form.validation.selectStartTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.workingSchedule.form.validation.selectEndTime")),
			trigger: "change",
		},
	],
	weekday: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.workingSchedule.form.validation.selectWeekday")),
			trigger: "change",
		},
	],
	managerName: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.workingSchedule.form.validation.enterManagerName")),
			trigger: "blur",
		},
	],
	phone: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.workingSchedule.form.validation.enterPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n(t("settingManage.organizeManage.workingSchedule.form.validation.invalidPhone")),
			trigger: "blur",
		},
	],
}));

// 默认对外导出
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
