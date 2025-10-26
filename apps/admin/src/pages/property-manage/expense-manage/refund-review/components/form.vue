<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { type RefundReviewFormProps, defaultForm } from "./form";
import { type 退费审核表单_VO, 费用类型Options, 审核状态Options, 退费原因Options } from "../test-data";

/** 表单组件的 props */
const props = defineProps<RefundReviewFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 退费审核表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 退费审核表单_VO;

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
	{
		label: "退费单号",
		prop: "退费单号",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "缴费单号",
		prop: "缴费单号",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "费用类型",
		prop: "费用类型",
		valueType: "select",
		options: 费用类型Options,
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "付费对象",
		prop: "付费对象",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "付费周期",
		prop: "付费周期",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "退费金额",
		prop: "应付金额实付金额",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "申请时间",
		prop: "申请时间",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "退费原因",
		prop: "退费原因",
		valueType: "select",
		options: 退费原因Options,
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "申请人",
		prop: "申请人",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "审核状态",
		prop: "审核状态",
		valueType: "select",
		options: 审核状态Options,
	},
	{
		label: "审核人",
		prop: "审核人",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "审核备注",
		prop: "审核备注",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},
]);

/** 表单验证规则 */
const plusFormRules = ref({
	审核状态: [
		{
			required: true,
			message: "请选择审核状态",
			trigger: "change",
		},
	],
	审核备注: [
		{
			required: true,
			message: "请输入审核备注",
			trigger: "blur",
		},
	],
});

// 对外导出
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
			:columns="plusFormColumns"
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