<!--
  欠费催缴表单
  用于新增 修改欠费催缴记录
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import {ReminderForOverduePaymentsFormProps,
	欠费催缴表单_VO,
	defaultForm,, reminderMethodOptions,, reminderStatusOptions,} from "./form";

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
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入业主名称",
		},
		required: true,
	},
	{
		label: "付费对象",
		prop: "付费对象",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入付费对象",
		},
		required: true,
	},
	{
		label: "费用名称",
		prop: "费用名称",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入费用名称",
		},
		required: true,
	},
	{
		label: "催缴金额",
		prop: "催缴金额",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入催缴金额",
		},
		required: true,
	},
	{
		label: "欠费时间段",
		prop: "欠费时间段",
		valueType: "date-picker",
		width: "360px",
		fieldProps: {
			type: "datetimerange",
			startPlaceholder: "开始时间",
			endPlaceholder: "结束时间",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	{
		label: "催缴方式",
		prop: "催缴方式",
		valueType: "select",
		width: "200px",
		options: reminderMethodOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择催缴方式",
		},
		required: true,
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		width: "200px",
		options: reminderStatusOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择状态",
		},
		required: true,
	},
	{
		label: "说明",
		prop: "说明",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入说明",
			rows: 3,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	业主名称: [{ required: true, message: "请输入业主名称", trigger: "blur" }],
	付费对象: [{ required: true, message: "请输入付费对象", trigger: "blur" }],
	费用名称: [{ required: true, message: "请输入费用名称", trigger: "blur" }],
	催缴金额: [
		{ required: true, message: "请输入催缴金额", trigger: "blur" },
		{
			validator: (rule, value, callback) => {
				if (!value) {
					callback(new Error("请输入催缴金额"));
				} else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
					callback(new Error("请输入正确的金额格式"));
				} else if (parseFloat(value) <= 0) {
					callback(new Error("催缴金额必须大于0"));
				} else {
					callback();
				}
			},
			trigger: "blur"
		},
	],
	欠费时间段: [
		{
			validator: (rule, value, callback) => {
				if (!value) {
					callback(new Error("请选择欠费时间段"));
				} else if (Array.isArray(value) && value.length === 2) {
					const [start, end] = value;
					if (new Date(start) >= new Date(end)) {
						callback(new Error("开始时间必须早于结束时间"));
					} else {
						callback();
					}
				} else if (typeof value === 'string') {
					callback();
				} else {
					callback(new Error("请选择有效的欠费时间段"));
				}
			},
			trigger: "change"
		},
	],
	催缴方式: [{ required: true, message: "请选择催缴方式", trigger: "change" }],
	状态: [{ required: true, message: "请选择状态", trigger: "change" }],
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
