<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { type RefundReviewFormProps, defaultForm } from "./form";

/** 表单组件的 props */
const props = defineProps<RefundReviewFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & RefundReviewFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & RefundReviewFormVO;

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
		label: "refundOrderNumber",
		prop: "refundOrderNumber",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "paymentOrderNumber",
		prop: "paymentOrderNumber",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "feeType",
		prop: "feeType",
		valueType: "select",
		options: feeTypeOptions,
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "payer",
		prop: "payer",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "paymentCycle",
		prop: "paymentCycle",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "退费金额",
		prop: "amount",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "applyTime",
		prop: "applyTime",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "refundReason",
		prop: "refundReason",
		valueType: "select",
		options: refundReasonOptions,
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "applicant",
		prop: "applicant",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "auditStatus",
		prop: "auditStatus",
		valueType: "select",
		options: auditStatusOptions,
	},
	{
		label: "auditor",
		prop: "auditor",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "auditRemark",
		prop: "auditRemark",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
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
