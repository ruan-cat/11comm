<!--
  欠费催缴表单
  用于新增 修改欠费催缴记录
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import {
	ReminderForOverduePaymentsFormProps,
	欠费催缴表单_VO,
	defaultForm,
	催缴方式Options,
	催缴状态Options,
} from "./form";

const props = defineProps<ReminderForOverduePaymentsFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 欠费催缴表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 欠费催缴表单_VO;

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
	// 业主名称
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
		required: true,
	},

	// 付费对象
	{
		label: "付费对象",
		prop: "付费对象",
		valueType: "input",
		required: true,
	},

	// 费用名称
	{
		label: "费用名称",
		prop: "费用名称",
		valueType: "input",
		required: true,
	},

	// 催缴金额
	{
		label: "催缴金额",
		prop: "催缴金额",
		valueType: "input",
		required: true,
	},

	// 欠费时间段
	{
		label: "欠费时间段",
		prop: "欠费时间段",
		valueType: "input",
		required: true,
	},

	// 催缴方式
	{
		label: "催缴方式",
		prop: "催缴方式",
		valueType: "select",
		options: 催缴方式Options,
		required: true,
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 催缴状态Options,
		required: true,
	},

	// 说明
	{
		label: "说明",
		prop: "说明",
		valueType: "textarea",
		required: false,
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
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
