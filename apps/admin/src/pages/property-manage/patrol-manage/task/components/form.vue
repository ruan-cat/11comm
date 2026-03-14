<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { type PatrolTaskFormProps } from "./form";
import type { PatrolTaskFormVO } from "@01s-11comm/type";
import { patrolStatusOptions } from "@01s-11comm/type";

const props = defineProps<PatrolTaskFormProps>();

const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PatrolTaskFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & PatrolTaskFormVO;

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

const translatedPatrolMethodOptions = withLocale(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.options.patrolMethod.walking")),
		value: "步行",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.options.patrolMethod.driving")),
		value: "乘车",
	},
]);

const translatedPatrolStatusOptions = withLocale(() =>
	patrolStatusOptions.map((option) => ({
		...option,
		label: transformI18n($t(`property-manage_patrol-manage.task.form.options.patrolStatus.${option.value}`)),
	})),
);

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.fields.taskCode")),
		prop: "taskCode",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.fields.patrolPlan")),
		prop: "patrolPlan",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.fields.patrolPersonTimeRange")),
		prop: "patrolPersonTimeRange",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.fields.actualPatrolTime")),
		prop: "actualPatrolTime",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.fields.plannedPatrolPerson")),
		prop: "plannedPatrolPerson",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.fields.currentPatrolPerson")),
		prop: "currentPatrolPerson",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.fields.transferDescription")),
		prop: "transferDescription",
		valueType: "textarea",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.fields.patrolMethod")),
		prop: "patrolMethod",
		valueType: "select",
		options: translatedPatrolMethodOptions.value,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.task.form.fields.patrolStatus")),
		prop: "patrolStatus",
		valueType: "select",
		options: translatedPatrolStatusOptions.value,
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	patrolPlan: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.task.form.validation.patrolPlan")),
			trigger: "blur",
		},
	],
	plannedPatrolPerson: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.task.form.validation.plannedPatrolPerson")),
			trigger: "blur",
		},
	],
	patrolMethod: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.task.form.validation.patrolMethod")),
			trigger: "change",
		},
	],
	patrolStatus: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.task.form.validation.patrolStatus")),
			trigger: "change",
		},
	],
}));

/** 动态计算的表单项配置 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 对外导出 */
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
			:columns="plusFormColumnsComputed"
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
