<!--
  产权登记表单
  用于新增 修改产权登记
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import type { 产权登记表单_VO } from "../test-data";
import { 审核状态Options } from "../test-data";
import type { PropertyRegisterFormProps } from "./form";

const props = defineProps<PropertyRegisterFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 产权登记表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 产权登记表单_VO;

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
	// 房屋产权ID
	{
		label: "房屋产权ID",
		prop: "房屋产权ID",
		valueType: "input",
		required: false,
		disabled: true,
	},

	// 房屋ID
	{
		label: "房屋ID",
		prop: "房屋ID",
		valueType: "input",
		required: true,
	},

	// 房屋编号
	{
		label: "房屋编号",
		prop: "房屋编号",
		valueType: "input",
		required: true,
	},

	// 姓名
	{
		label: "姓名",
		prop: "姓名",
		valueType: "input",
		required: true,
	},

	// 联系方式
	{
		label: "联系方式",
		prop: "联系方式",
		valueType: "input",
		required: true,
	},

	// 身份证号
	{
		label: "身份证号",
		prop: "身份证号",
		valueType: "input",
		required: true,
	},

	// 地址
	{
		label: "地址",
		prop: "地址",
		valueType: "input",
		required: true,
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 审核状态Options,
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
			:row-props="{ gutter: 20 }"
			:col-props="{
				span: 12,
			}"
			:label-width="100"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>