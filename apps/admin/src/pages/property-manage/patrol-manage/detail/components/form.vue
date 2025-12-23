<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import type { Mode } from "@/composables/use-mode";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import type { PatrolDetailFormVO } from "@01s-11comm/type";
import { patrolMethodOptions } from "@01s-11comm/type";
import { type PatrolDetailFormProps } from "./form";

const props = defineProps<PatrolDetailFormProps & { mode: Mode }>();

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
const toRefForm = structuredClone(props.form) as FieldValues & PatrolDetailFormVO;

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

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	// 巡检点名称
	{
		label: "巡检点名称",
		prop: "patrolPointName",
		valueType: "input",
		required: true,
	},

	// 巡检计划名称
	{
		label: "巡检计划名称",
		prop: "patrolPlanName",
		valueType: "input",
		required: true,
	},

	// 巡检路线名称
	{
		label: "巡检路线名称",
		prop: "patrolRouteName",
		valueType: "input",
		required: true,
	},

	// 计划巡检人
	{
		label: "计划巡检人",
		prop: "plannedPatrolPerson",
		valueType: "input",
		required: true,
	},

	// 巡检方式
	{
		label: "巡检方式",
		prop: "patrolMethod",
		valueType: "select",
		required: true,
		options: patrolMethodOptions,
	},

	// 位置信息
	{
		label: "位置信息",
		prop: "location",
		valueType: "input",
		required: true,
	},

	// 巡检情况
	{
		label: "巡检情况",
		prop: "patrolSituation",
		valueType: "textarea",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({});

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
			:columns="plusFormColumnsComputed"
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
