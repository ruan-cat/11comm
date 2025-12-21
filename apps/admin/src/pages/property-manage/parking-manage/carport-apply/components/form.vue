<!--
  车位申请表单
  用于新增 修改车位申请
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { CarportApplyFormProps, 车位申请_VO } from "./form";

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
const toRefForm = structuredClone(props.form) as FieldValues & 车位申请_VO;

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

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	车牌号: [
		{
			required: true,
			message: "请输入车牌号",
			trigger: "blur",
		},
	],
	停车位: [
		{
			required: true,
			message: "请输入停车位",
			trigger: "blur",
		},
	],
	汽车品牌: [
		{
			required: true,
			message: "请选择汽车品牌",
			trigger: "change",
		},
	],
	车辆类型: [
		{
			required: true,
			message: "请选择车辆类型",
			trigger: "change",
		},
	],
	颜色: [
		{
			required: true,
			message: "请选择颜色",
			trigger: "change",
		},
	],
	起租时间: [
		{
			required: true,
			message: "请选择起租时间",
			trigger: "change",
		},
	],
	结租时间: [
		{
			required: true,
			message: "请选择结租时间",
			trigger: "change",
		},
	],
	申请人: [
		{
			required: true,
			message: "请输入申请人",
			trigger: "blur",
		},
	],
	手机号: [
		{
			required: true,
			message: "请输入手机号",
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号格式",
			trigger: "blur",
		},
	],
	审核结果: [
		{
			required: true,
			message: "请选择审核结果",
			trigger: "change",
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
