<!--
  车位结构图表单
  用于新增 修改车位结构图信息
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { ParkingSpaceStructureDiagramFormProps, 车位结构图表单_VO } from "./form";
import { 车位类型选项, 车位状态选项, 楼层区域选项, 是否充电桩选项 } from "@01s-11comm/type";
const props = defineProps<ParkingSpaceStructureDiagramFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 车位结构图表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 车位结构图表单_VO;

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
	// 车位基础信息
	{
		label: "车位编号",
		prop: "车位编号",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入车位编号，如：B1-A001",
		},
		required: true,
	},
	{
		label: "车位类型",
		prop: "车位类型",
		valueType: "select",
		width: "160px",
		options: 车位类型选项,
		fieldProps: {
			clearable: true,
			placeholder: "请选择车位类型",
		},
		required: true,
	},
	{
		label: "车位状态",
		prop: "车位状态",
		valueType: "select",
		width: "140px",
		options: 车位状态选项,
		fieldProps: {
			clearable: true,
			placeholder: "请选择车位状态",
		},
		required: true,
	},
	{
		label: "车位位置",
		prop: "车位位置",
		valueType: "input",
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入车位详细位置",
		},
		required: true,
	},
	{
		label: "车位面积",
		prop: "车位面积",
		valueType: "input-number",
		width: "150px",
		fieldProps: {
			placeholder: "请输入车位面积",
			min: 0,
			step: 0.1,
			controlsPosition: "right",
		},
		required: true,
	},
	{
		label: "车位朝向",
		prop: "车位朝向",
		valueType: "select",
		width: "120px",
		options: [
			{ label: "南北", value: "南北" },
			{ label: "东西", value: "东西" },
			{ label: "南", value: "南" },
			{ label: "北", value: "北" },
			{ label: "东", value: "东" },
			{ label: "西", value: "西" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择朝向",
		},
		required: true,
	},
	{
		label: "楼层区域",
		prop: "楼层区域",
		valueType: "select",
		width: "140px",
		options: 楼层区域选项,
		fieldProps: {
			clearable: true,
			placeholder: "请选择楼层区域",
		},
		required: true,
	},

	// 业主信息
	{
		label: "业主姓名",
		prop: "业主姓名",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入业主姓名",
		},
	},
	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入联系电话",
		},
	},

	// 车辆信息
	{
		label: "车牌号码",
		prop: "车牌号码",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入车牌号码",
		},
	},
	{
		label: "车辆品牌",
		prop: "车辆品牌",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入车辆品牌型号",
		},
	},

	// 费用信息
	{
		label: "购买时间",
		prop: "购买时间",
		valueType: "date-picker",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择购买时间",
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
	},
	{
		label: "到期时间",
		prop: "到期时间",
		valueType: "date-picker",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择到期时间",
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
		hidden: (form: 车位结构图表单_VO) => form.车位状态 !== "已租",
	},
	{
		label: "月租金",
		prop: "月租金",
		valueType: "input-number",
		width: "150px",
		fieldProps: {
			placeholder: "请输入月租金",
			min: 0,
			step: 10,
			controlsPosition: "right",
		},
		hidden: (form: 车位结构图表单_VO) => form.车位状态 !== "已租",
	},
	{
		label: "管理费",
		prop: "管理费",
		valueType: "input-number",
		width: "150px",
		fieldProps: {
			placeholder: "请输入管理费",
			min: 0,
			step: 5,
			controlsPosition: "right",
		},
		required: true,
	},

	// 充电设施
	{
		label: "是否充电桩",
		prop: "是否充电桩",
		valueType: "select",
		width: "140px",
		options: 是否充电桩选项,
		fieldProps: {
			clearable: true,
			placeholder: "请选择",
		},
		required: true,
	},
	{
		label: "充电桩功率",
		prop: "充电桩功率",
		valueType: "select",
		width: "140px",
		options: [
			{ label: "3.5kW", value: "3.5kW" },
			{ label: "7kW", value: "7kW" },
			{ label: "11kW", value: "11kW" },
			{ label: "22kW", value: "22kW" },
			{ label: "7kW/3.5kW", value: "7kW/3.5kW" },
			{ label: "11kW/7kW", value: "11kW/7kW" },
			{ label: "其他", value: "其他" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择功率",
		},
		hidden: (form: 车位结构图表单_VO) => form.是否充电桩 !== "是",
	},

	// 备注信息
	{
		label: "备注信息",
		prop: "备注信息",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	车位编号: [
		{ required: true, message: "请输入车位编号", trigger: "blur" },
		{ min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
	],
	车位类型: [
		{ required: true, message: "请选择车位类型", trigger: "change" },
	],
	车位状态: [
		{ required: true, message: "请选择车位状态", trigger: "change" },
	],
	车位位置: [
		{ required: true, message: "请输入车位位置", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	车位面积: [
		{ required: true, message: "请输入车位面积", trigger: "blur" },
	],
	车位朝向: [
		{ required: true, message: "请选择车位朝向", trigger: "change" },
	],
	楼层区域: [
		{ required: true, message: "请选择楼层区域", trigger: "change" },
	],
	业主姓名: [
		{ min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
	],
	联系电话: [
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	车牌号码: [
		{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: "请输入正确的车牌号码", trigger: "blur" },
	],
	车辆品牌: [
		{ min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" },
	],
	到期时间: [
		{ required: true, message: "请选择到期时间", trigger: "change" },
	],
	月租金: [
		{ required: true, message: "请输入月租金", trigger: "blur" },
	],
	管理费: [
		{ required: true, message: "请输入管理费", trigger: "blur" },
	],
	是否充电桩: [
		{ required: true, message: "请选择是否配备充电桩", trigger: "change" },
	],
	充电桩功率: [
		{ required: true, message: "请选择充电桩功率", trigger: "change" },
	],
	备注信息: [
		{ max: 500, message: "备注信息长度不能超过 500 个字符", trigger: "blur" },
	],
});

/** 默认对外导出函数 */
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
			:label-width="120"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>