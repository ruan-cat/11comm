<!--
  车位申请表单
  用于新增 修改车位申请
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { CarportApplyFormProps, 车位申请_VO, defaultForm } from "./form";
import { 审核结果Options, 车辆类型Options, 汽车品牌Options, 车辆颜色Options } from "../test-data";

const props = defineProps<CarportApplyFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 车位申请_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 车位申请_VO;

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
	// 车牌号
	{
		label: "车牌号",
		prop: "车牌号",
		valueType: "input",
		required: true,
	},

	// 停车位
	{
		label: "停车位",
		prop: "停车位",
		valueType: "input",
		required: true,
	},

	// 汽车品牌
	{
		label: "汽车品牌",
		prop: "汽车品牌",
		valueType: "select",
		options: 汽车品牌Options,
		required: true,
	},

	// 车辆类型
	{
		label: "车辆类型",
		prop: "车辆类型",
		valueType: "select",
		options: 车辆类型Options,
		required: true,
	},

	// 颜色
	{
		label: "颜色",
		prop: "颜色",
		valueType: "select",
		options: 车辆颜色Options,
		required: true,
	},

	// 起租时间
	{
		label: "起租时间",
		prop: "起租时间",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
		required: true,
	},

	// 结租时间
	{
		label: "结租时间",
		prop: "结租时间",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
		required: true,
	},

	// 申请人
	{
		label: "申请人",
		prop: "申请人",
		valueType: "input",
		required: true,
	},

	// 手机号
	{
		label: "手机号",
		prop: "手机号",
		valueType: "input",
		required: true,
	},

	// 审核结果
	{
		label: "审核结果",
		prop: "审核结果",
		valueType: "select",
		options: 审核结果Options,
		required: true,
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验 */
const plusFormRules = {};

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