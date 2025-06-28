<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { HouseChargeFormProps, 费用类型, 房屋收费_VO, defaultForm } from "./form";

const props = defineProps<HouseChargeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 房屋收费_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 房屋收费_VO;

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
	// 费用类型
	{
		label: "费用类型",
		prop: "费用类型",
	},

	// 收费项目
	{
		label: "收费项目",
		prop: "收费项目",
		valueType: "input",
		required: true,
	},

	// 费用标识
	{
		label: "费用标识",
		prop: "费用标识",
		valueType: "select",
		options: [
			{ label: "周期性费用", value: "周期性费用" },
			{ label: "一次性费用", value: "一次性费用" },
		],
		required: true,
	},

	// 付费类型
	{
		label: "付费类型",
		prop: "付费类型",
		valueType: "select",
		options: [
			{ label: "预付费", value: "预付费" },
			{ label: "后付费", value: "后付费" },
		],
		required: true,
	},
	// 缴费周期
	{
		label: "缴费周期(单位:月)",
		prop: "缴费周期(单位:月)",
		valueType: "input",
		required: true,
		hidden: (form) => form.费用类型 === "押金",
	},
	// 预付期
	{
		label: "预付期(单位:天)",
		prop: "预付期(单位:天)",
		valueType: "input",
		required: true,
		hidden: (form) => form.费用类型 === "煤气费",
	},
	// 单位
	{
		label: "单位",
		prop: "单位",
		valueType: "input",
		required: true,
	},
	// 账户抵扣
	{
		label: "账户抵扣",
		prop: "账户抵扣",
		valueType: "select",
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		required: true,
	},
	// 手机缴费
	{
		label: "手机缴费",
		prop: "手机缴费",
		valueType: "select",
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		required: true,
	},
	// 进位方式
	{
		label: "进位方式",
		prop: "进位方式",
		valueType: "select",
		options: [
			{ label: "四舍五入", value: "四舍五入" },
			{ label: "向上取整", value: "向上取整" },
			{ label: "向下取整", value: "向下取整" },
		],
		required: true,
	},
	// 保留小数位
	{
		label: "保留小数位",
		prop: "保留小数位",
		valueType: "select",
		options: [
			{ label: "取整", value: "取整" },
			{ label: "1位", value: "1位" },
			{ label: "2位", value: "2位" },
			{ label: "3位", value: "3位" },
			{ label: "4位", value: "4位" },
		],
		required: true,
	},
	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: [
			{ label: "启用", value: "启用" },
			{ label: "禁用", value: "禁用" },
		],
		required: true,
	},
	// 计算公式
	{
		label: "计算公式",
		prop: "计算公式",
		valueType: "input",
		required: true,
	},
	// 计费单价
	{
		label: "计费单价",
		prop: "计费单价",
		valueType: "input",
		required: true,
	},
	// 固定费用
	{
		label: "固定费用",
		prop: "固定费用",
		valueType: "input",
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
