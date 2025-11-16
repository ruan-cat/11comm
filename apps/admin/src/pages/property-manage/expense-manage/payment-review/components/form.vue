<!--
  缴费审核表单
  用于审核缴费记录
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { 缴费审核FormProps, 缴费审核_表单数据, defaultForm } from "./form";

const props = defineProps<缴费审核FormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 缴费审核_表单数据;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 缴费审核_表单数据;

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
	// 房屋
	{
		label: "房屋",
		prop: "房屋",
		valueType: "input",
	},

	// 费用项目
	{
		label: "费用项目",
		prop: "费用项目",
		valueType: "select",
		options: [
			{ label: "物业费", value: "物业费" },
			{ label: "停车费", value: "停车费" },
			{ label: "水电费", value: "水电费" },
			{ label: "燃气费", value: "燃气费" },
			{ label: "暖气费", value: "暖气费" },
			{ label: "其他费用", value: "其他费用" },
		],
	},

	// 付费周期
	{
		label: "付费周期",
		prop: "付费周期",
		valueType: "input",
	},

	// 缴费起始时间
	{
		label: "缴费起始时间",
		prop: "缴费起始时间",
		valueType: "date",
	},

	// 缴费结束时间
	{
		label: "缴费结束时间",
		prop: "缴费结束时间",
		valueType: "date",
	},

	// 应付金额
	{
		label: "应付金额",
		prop: "应付金额",
		valueType: "input",
	},

	// 实付金额
	{
		label: "实付金额",
		prop: "实付金额",
		valueType: "input",
	},

	// 操作员工
	{
		label: "操作员工",
		prop: "操作员工",
		valueType: "input",
	},

	// 缴费时间
	{
		label: "缴费时间",
		prop: "缴费时间",
		valueType: "datetime",
	},

	// 审核状态
	{
		label: "审核状态",
		prop: "审核状态",
		valueType: "select",
		options: [
			{ label: "待审核", value: "待审核" },
			{ label: "审核通过", value: "审核通过" },
			{ label: "审核拒绝", value: "审核拒绝" },
		],
	},

	// 审核说明
	{
		label: "审核说明",
		prop: "审核说明",
		valueType: "textarea",
	},

	// 缴费备注
	{
		label: "缴费备注",
		prop: "缴费备注",
		valueType: "textarea",
	},

	// 详情
	{
		label: "详情",
		prop: "详情",
		valueType: "textarea",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
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
