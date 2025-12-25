<!--
  业主车辆表单
  用于新增和修改业主车辆
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { OwnerVehicleFormVO } from "@01s-11comm/type";
import { vehicleTypeOptions, licensePlateTypeOptions } from "@01s-11comm/type";
import type { OwnerVehicleFormProps } from "./form";

const props = defineProps<OwnerVehicleFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OwnerVehicleFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & OwnerVehicleFormVO;

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
		prop: "licensePlate",
		valueType: "input",
		required: true,
	},

	// 汽车品牌
	{
		label: "汽车品牌",
		prop: "carBrand",
		valueType: "input",
	},

	// 车类型
	{
		label: "车类型",
		prop: "carType",
		valueType: "select",
		options: vehicleTypeOptions,
		required: true,
	},

	// 颜色
	{
		label: "颜色",
		prop: "color",
		valueType: "input",
	},

	// 车牌类型
	{
		label: "车牌类型",
		prop: "licensePlateType",
		valueType: "select",
		options: licensePlateTypeOptions,
		required: true,
	},

	// 业主
	{
		label: "业主",
		prop: "owner",
		valueType: "input",
		required: true,
		disabled: true, //不可输入（这里disabled无用）且有一个【按钮】和一个【添加链接】
	},

	// 车位
	{
		label: "车位",
		prop: "parkingSpace",
		valueType: "input",
		required: true,
		disabled: true, //不可输入（这里disabled无用）且有一个【按钮】和一个【添加链接】
	},

	// 业主车辆
	{
		label: "业主车辆",
		prop: "ownerVehicle",
		valueType: "select",
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		required: true,
	},

	// 开始时间
	{
		label: "开始时间",
		prop: "startTime",
		valueType: "date-picker",
		required: true,
	},

	// 结束时间
	{
		label: "结束时间",
		prop: "endTime",
		valueType: "date-picker",
		required: true,
	},

	// 备注
	{
		label: "备注",
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	licensePlate: [
		{
			required: true,
			message: "请输入车牌号",
			trigger: "blur",
		},
	],
	carType: [
		{
			required: true,
			message: "请选择车类型",
			trigger: "change",
		},
	],
	licensePlateType: [
		{
			required: true,
			message: "请选择车牌类型",
			trigger: "change",
		},
	],
	owner: [
		{
			required: true,
			message: "请输入业主",
			trigger: "blur",
		},
	],
	parkingSpace: [
		{
			required: true,
			message: "请输入车位",
			trigger: "blur",
		},
	],
	ownerVehicle: [
		{
			required: true,
			message: "请选择是否业主车辆",
			trigger: "change",
		},
	],
	startTime: [
		{
			required: true,
			message: "请选择开始时间",
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: "请选择结束时间",
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
