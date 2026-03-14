<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { type PatrolPointFormProps } from "./form";
import type { PatrolPointFormVO } from "@01s-11comm/type";
import {
	patrolMethodOptions,
	checkInStatusOptions,
	taskStatusOptions,
	patrolPointStatusOptions,
	patrolSituationOptions,
} from "@01s-11comm/type";

/** 表单组件的 props */
const props = defineProps<PatrolPointFormProps>();
const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PatrolPointFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const form = ref(cloneDeep(props.form) as FieldValues & PatrolPointFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.patrolPointName")),
		prop: "patrolPointName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.patrolPlanName")),
		prop: "patrolPlanName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.patrolRouteName")),
		prop: "patrolRouteName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.planPatrolPerson")),
		prop: "planPatrolPerson",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.patrolMethod")),
		prop: "patrolMethod",
		valueType: "select",
		options: patrolMethodOptions,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.actualCheckInStatus")),
		prop: "actualCheckInStatus",
		valueType: "select",
		options: checkInStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.taskStatus")),
		prop: "taskStatus",
		valueType: "select",
		options: taskStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.patrolPointStatus")),
		prop: "patrolPointStatus",
		valueType: "select",
		options: patrolPointStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.patrolSituation")),
		prop: "patrolSituation",
		valueType: "select",
		options: patrolSituationOptions,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.point.form.fields.locationInfo")),
		prop: "locationInfo",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	patrolPointName: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.point.form.validation.patrolPointName")),
			trigger: "blur",
		},
	],
	patrolPlanName: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.point.form.validation.patrolPlanName")),
			trigger: "blur",
		},
	],
	patrolRouteName: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.point.form.validation.patrolRouteName")),
			trigger: "blur",
		},
	],
	planPatrolPerson: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.point.form.validation.planPatrolPerson")),
			trigger: "blur",
		},
	],
	patrolMethod: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.point.form.validation.patrolMethod")),
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
