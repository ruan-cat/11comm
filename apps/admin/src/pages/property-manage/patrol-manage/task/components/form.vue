<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import { type PatrolTaskFormProps, type PatrolTaskFormVO } from "./form";
import { patrolStatusOptions } from "@01s-11comm/type";

const props = defineProps<PatrolTaskFormProps>();

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
const toRefForm = structuredClone(props.form) as FieldValues & PatrolTaskFormVO;

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
		label: "任务编码",
		prop: "任务编码",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "巡检计划",
		prop: "巡检计划",
		valueType: "input",
	},
	{
		label: "巡检人开始/结束时间",
		prop: "巡检人开始/结束时间",
		valueType: "input",
	},
	{
		label: "实际巡检时间",
		prop: "实际巡检时间",
		valueType: "input",
	},
	{
		label: "计划巡检人",
		prop: "计划巡检人",
		valueType: "input",
	},
	{
		label: "当前巡检人",
		prop: "当前巡检人",
		valueType: "input",
	},
	{
		label: "转移描述",
		prop: "转移描述",
		valueType: "textarea",
	},
	{
		label: "巡检方式",
		prop: "巡检方式",
		valueType: "select",
		options: [
			{
				label: "步行",
				value: "步行",
			},
			{
				label: "乘车",
				value: "乘车",
			},
		],
	},
	{
		label: "巡检状态",
		prop: "巡检状态",
		valueType: "select",
		options: patrolStatusOptions,
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	巡检计划: [
		{
			required: true,
			message: "请输入巡检计划",
			trigger: "blur",
		},
	],
	计划巡检人: [
		{
			required: true,
			message: "请输入计划巡检人",
			trigger: "blur",
		},
	],
	巡检方式: [
		{
			required: true,
			message: "请选择巡检方式",
			trigger: "change",
		},
	],
	巡检状态: [
		{
			required: true,
			message: "请选择巡检状态",
			trigger: "change",
		},
	],
});

/** 动态计算的表单项配置 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 对外导出 */
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
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
