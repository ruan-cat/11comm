<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { type PatrolPointFormProps, type PatrolPointFormVO } from "./form";
import {
	patrolMethodFormOptions,
	checkInStatusFormOptions,
	taskStatusFormOptions,
	patrolPointStatusFormOptions,
	patrolSituationFormOptions,
} from "./form";

/** 表单组件的 props */
const props = defineProps<PatrolPointFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PatrolPointFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & PatrolPointFormVO;

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
	{
		label: "巡检点名称",
		prop: "patrolPointName",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入巡检点名称",
		},
	},
	{
		label: "巡检计划名称",
		prop: "patrolPlanName",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入巡检计划名称",
		},
	},
	{
		label: "巡检路线名称",
		prop: "patrolRouteName",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入巡检路线名称",
		},
	},
	{
		label: "计划巡检人",
		prop: "planPatrolPerson",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入计划巡检人",
		},
	},
	{
		label: "巡检方式",
		prop: "patrolMethod",
		valueType: "select",
		options: patrolMethodFormOptions,
		fieldProps: {
			placeholder: "请选择巡检方式",
		},
	},
	{
		label: "实际签到状态",
		prop: "actualCheckInStatus",
		valueType: "select",
		options: checkInStatusFormOptions,
		fieldProps: {
			placeholder: "请选择实际签到状态",
		},
	},
	{
		label: "任务状态",
		prop: "taskStatus",
		valueType: "select",
		options: taskStatusFormOptions,
		fieldProps: {
			placeholder: "请选择任务状态",
		},
	},
	{
		label: "巡检点状态",
		prop: "patrolPointStatus",
		valueType: "select",
		options: patrolPointStatusFormOptions,
		fieldProps: {
			placeholder: "请选择巡检点状态",
		},
	},
	{
		label: "巡检情况",
		prop: "patrolSituation",
		valueType: "select",
		options: patrolSituationFormOptions,
		fieldProps: {
			placeholder: "请选择巡检情况",
		},
	},
	{
		label: "位置信息",
		prop: "locationInfo",
		valueType: "textarea",
		fieldProps: {
			placeholder: "请输入位置信息",
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	patrolPointName: [{ required: true, message: "请输入巡检点名称", trigger: "blur" }],
	patrolPlanName: [{ required: true, message: "请输入巡检计划名称", trigger: "blur" }],
	patrolRouteName: [{ required: true, message: "请输入巡检路线名称", trigger: "blur" }],
	planPatrolPerson: [{ required: true, message: "请输入计划巡检人", trigger: "blur" }],
	patrolMethod: [{ required: true, message: "请选择巡检方式", trigger: "change" }],
});

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
