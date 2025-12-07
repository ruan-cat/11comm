<!--
  场地预约表单
  用于新增 修改场地预约
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { type ReserveVenueFormProps } from "./form";
import { 场地类型Options, 预约状态Options, type 场地预约_VO } from "../test-data";
import { defaultForm } from "./form";

const props = defineProps<ReserveVenueFormProps>();
const defaultValues = props.defaultValues as FieldValues & 场地预约_VO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);
/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = cloneDeep(props.form) as FieldValues & 场地预约_VO;

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
	// 预约人
	{
		label: "预约人",
		prop: "预约人",
		valueType: "input",
		required: true,
	},

	// 联系电话
	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
		required: true,
	},

	// 预约时间
	{
		label: "预约时间",
		prop: "预约时间",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
		required: true,
	},

	// 开始时间
	{
		label: "开始时间",
		prop: "开始时间",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
		required: true,
	},

	// 结束时间
	{
		label: "结束时间",
		prop: "结束时间",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
		required: true,
	},

	// 场地类型
	{
		label: "场地类型",
		prop: "场地类型",
		valueType: "select",
		options: 场地类型Options.map((item) => ({ label: item.label, value: item.value })),
		required: true,
	},

	// 预约状态
	{
		label: "预约状态",
		prop: "预约状态",
		valueType: "select",
		options: 预约状态Options.map((item) => ({ label: item.label, value: item.value })),
		required: true,
	},

	// 使用人数
	{
		label: "使用人数",
		prop: "使用人数",
		valueType: "input-number",
		required: true,
	},

	// 备注
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	预约人: [
		{
			required: true,
			message: "请输入预约人",
			trigger: "blur",
		},
	],
	联系电话: [
		{
			required: true,
			message: "请输入联系电话",
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号格式",
			trigger: "blur",
		},
	],
	预约时间: [
		{
			required: true,
			message: "请选择预约时间",
			trigger: "change",
		},
	],
	开始时间: [
		{
			required: true,
			message: "请选择开始时间",
			trigger: "change",
		},
	],
	结束时间: [
		{
			required: true,
			message: "请选择结束时间",
			trigger: "change",
		},
	],
	场地类型: [
		{
			required: true,
			message: "请选择场地类型",
			trigger: "change",
		},
	],
	预约状态: [
		{
			required: true,
			message: "请选择预约状态",
			trigger: "change",
		},
	],
	使用人数: [
		{
			required: true,
			message: "请输入使用人数",
			trigger: "blur",
		},
	],
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
