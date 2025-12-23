<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { PatrolPlanFormProps } from "./form";
import type { PatrolPlanFormVO } from "@01s-11comm/type";
import { checkInMethodOptions } from "@01s-11comm/type";
import { statusOptions } from "@01s-11comm/type";

const props = defineProps<PatrolPlanFormProps>();

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
const toRefForm = structuredClone(props.form) as FieldValues & PatrolPlanFormVO;

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
		label: "计划名称",
		prop: "planName",
		valueType: "input",
	},
	{
		label: "计划路线",
		prop: "planRoute",
		valueType: "input",
	},
	{
		label: "计划周期",
		prop: "planCycle",
		valueType: "select",
		options: [
			{ label: "每日", value: "每日" },
			{ label: "每周", value: "每周" },
			{ label: "每月", value: "每月" },
			{ label: "每季度", value: "每季度" },
			{ label: "每年", value: "每年" },
		],
	},
	{
		label: "签到方式",
		prop: "checkInMethod",
		valueType: "select",
		options: checkInMethodOptions,
	},
	{
		label: "日期范围",
		prop: "dateRange",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
		},
	},
	{
		label: "时间范围",
		prop: "timeRange",
		valueType: "time-picker",
		fieldProps: {
			isRange: true,
		},
	},
	{
		label: "任务提前(分钟)",
		prop: "taskAdvanceMinutes",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			max: 1440,
		},
	},
	{
		label: "巡检人员",
		prop: "patrolStaff",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: statusOptions,
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	planName: [{ required: true, message: "请输入计划名称", trigger: "blur" }],
	planRoute: [{ required: true, message: "请输入计划路线", trigger: "blur" }],
	planCycle: [{ required: true, message: "请选择计划周期", trigger: "change" }],
	checkInMethod: [{ required: true, message: "请选择签到方式", trigger: "change" }],
	dateRange: [{ required: true, message: "请选择日期范围", trigger: "change" }],
	timeRange: [{ required: true, message: "请选择时间范围", trigger: "change" }],
	taskAdvanceMinutes: [
		{ required: true, message: "请输入任务提前时间", trigger: "blur" },
		{ type: "number" as const, min: 0, max: 1440, message: "请输入0-1440之间的数字", trigger: "blur" },
	],
	patrolStaff: [{ required: true, message: "请输入巡检人员", trigger: "blur" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

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
