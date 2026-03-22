<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { PatrolPlanFormProps } from "./form";
import type { PatrolPlanFormVO } from "@01s-11comm/type";
import { checkInMethodOptions } from "@01s-11comm/type";
import { statusOptions } from "@01s-11comm/type";

const props = defineProps<PatrolPlanFormProps>();

const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PatrolPlanFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & PatrolPlanFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedPlanCycleOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.options.planCycle.daily")),
		value: "每日",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.options.planCycle.weekly")),
		value: "每周",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.options.planCycle.monthly")),
		value: "每月",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.options.planCycle.quarterly")),
		value: "每季度",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.options.planCycle.yearly")),
		value: "每年",
	},
]);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.fields.planName")),
		prop: "planName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.fields.planRoute")),
		prop: "planRoute",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.fields.planCycle")),
		prop: "planCycle",
		valueType: "select",
		options: translatedPlanCycleOptions.value,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.fields.checkInMethod")),
		prop: "checkInMethod",
		valueType: "select",
		options: checkInMethodOptions,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.fields.dateRange")),
		prop: "dateRange",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.fields.timeRange")),
		prop: "timeRange",
		valueType: "time-picker",
		fieldProps: {
			isRange: true,
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.fields.taskAdvanceMinutes")),
		prop: "taskAdvanceMinutes",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			max: 1440,
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.fields.patrolStaff")),
		prop: "patrolStaff",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.plan.form.fields.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions,
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	planName: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.planName")),
			trigger: "blur",
		},
	],
	planRoute: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.planRoute")),
			trigger: "blur",
		},
	],
	planCycle: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.planCycle")),
			trigger: "change",
		},
	],
	checkInMethod: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.checkInMethod")),
			trigger: "change",
		},
	],
	dateRange: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.dateRange")),
			trigger: "change",
		},
	],
	timeRange: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.timeRange")),
			trigger: "change",
		},
	],
	taskAdvanceMinutes: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.taskAdvanceMinutes")),
			trigger: "blur",
		},
		{
			type: "number" as const,
			min: 0,
			max: 1440,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.taskAdvanceMinutesRange")),
			trigger: "blur",
		},
	],
	patrolStaff: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.patrolStaff")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.plan.form.validation.status")),
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
	<section :key="locale" class="form-root">
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
