<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import type { Mode } from "@/composables/use-mode";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import type { PatrolDetailFormVO } from "@01s-11comm/type";
import { patrolMethodOptions } from "@01s-11comm/type";
import { type PatrolDetailFormProps } from "./form";

const props = defineProps<PatrolDetailFormProps & { mode: Mode }>();

const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PatrolDetailFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & PatrolDetailFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 巡检点名称
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.form.fields.patrolPointName")),
		prop: "patrolPointName",
		valueType: "input",
		required: true,
	},
	// 巡检计划名称
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.form.fields.patrolPlanName")),
		prop: "patrolPlanName",
		valueType: "input",
		required: true,
	},

	// 巡检路线名称
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.form.fields.patrolRouteName")),
		prop: "patrolRouteName",
		valueType: "input",
		required: true,
	},

	// 计划巡检人
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.form.fields.plannedPatrolPerson")),
		prop: "plannedPatrolPerson",
		valueType: "input",
		required: true,
	},

	// 巡检方式
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.form.fields.patrolMethod")),
		prop: "patrolMethod",
		valueType: "select",
		required: true,
		options: patrolMethodOptions,
	},

	// 位置信息
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.form.fields.location")),
		prop: "location",
		valueType: "input",
		required: true,
	},

	// 巡检情况
	{
		label: transformI18n($t("property-manage_patrol-manage.detail.form.fields.patrolSituation")),
		prop: "patrolSituation",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({}));

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
			:label-width="120"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
