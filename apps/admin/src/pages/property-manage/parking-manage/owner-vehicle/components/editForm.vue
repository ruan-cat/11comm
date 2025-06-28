<!--
  业主车辆表单
  用于 修改业主车辆
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { OwnerVehicleFormProps, 业主车辆修改表单_VO, defaultForm } from "./editForm";
import { useDisabled, useFormDisabled } from "element-plus";

const props = defineProps<OwnerVehicleFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 业主车辆修改表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 业主车辆修改表单_VO;

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

	// 汽车品牌
	{
		label: "车品牌",
		prop: "车品牌",
		valueType: "input",
	},

	// 车类型
	{
		label: "车类型",
		prop: "车类型",
		valueType: "select",
		options: [
			{ label: "家用小汽车", value: "家用小汽车" },
			{ label: "客车", value: "客车" },
			{ label: "货车", value: "货车" },
			{ label: "电动车", value: "电动车" },
			{ label: "三轮车", value: "三轮车" },
			{ label: "信用期车辆(1个月)", value: "信用期车辆(1个月)" },
		],
		required: true,
	},

	// 颜色
	{
		label: "颜色",
		prop: "颜色",
		valueType: "input",
	},

	// 车牌类型
	{
		label: "车牌类型",
		prop: "车牌类型",
		valueType: "select",
		options: [
			{ label: "月租车", value: "月租车" },
			{ label: "出售车辆", value: "出售车辆" },
			{ label: "内部车", value: "内部车" },
			{ label: "免费车", value: "免费车" },
		],
		required: true,
	},

	// 开始时间
	{
		label: "起租时间",
		prop: "起租时间",
		valueType: "date-picker",
		required: true,
	},

	// 结束时间
	{
		label: "结租时间",
		prop: "结租时间",
		valueType: "date-picker",
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
		:label-width="100"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
