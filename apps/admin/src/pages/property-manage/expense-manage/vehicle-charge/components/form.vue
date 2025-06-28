<!--
  车辆收费表单
  用于新增 修改车辆收费
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { VehicleChargeFormProps, 费用类型, 车辆收费表单_VO, defaultForm } from "./form";

const props = defineProps<VehicleChargeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 车辆收费表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 车辆收费表单_VO;

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
	//收费范围
	{
		label: "收费范围",
		prop: "收费范围",
		valueType: "select",
		options: [
			{ label: "小区", value: "小区" },
			{ label: "停车场", value: "停车场" },
		],
		required: true,
	},
	// 费用类型
	{
		label: "费用类型",
		prop: "费用类型",
		required: true,
	},
	// 收费项目
	{
		label: "收费项目",
		prop: "收费项目",
		required: true,
	},
	//车位状态
	{
		label: "车位状态",
		prop: "车位状态",
		valueType: "select",
		options: [
			{ label: "已出售", value: "已出售" },
			{ label: "已出租", value: "已出租" },
		],
	},
	//计费起始时间
	{
		label: "计费起始时间",
		prop: "计费起始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	//计费结束时间
	{
		label: "计费结束时间",
		prop: "计费结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
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
	<PlusForm
		ref="plusFormRef"
		v-model="form"
		class="form-root"
		:has-footer="false"
		:default-values="defaultValues"
		:columns="plusFormColumnsComputed"
		:rules="plusFormRules"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
