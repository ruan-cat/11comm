<!--
  缴费审核表单
  用于审核缴费记录
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { PaymentReviewFormProps, PaymentReviewFormVO, defaultForm } from "./form";

const props = defineProps<PaymentReviewFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PaymentReviewFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & PaymentReviewFormVO;

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
		label: "房屋",
		prop: "house",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入房屋编号，如：A栋101",
		},
		required: true,
	},
	{
		label: "费用项目",
		prop: "expenseItem",
		valueType: "select",
		width: "140px",
		options: [
			{ label: "物业费", value: "物业费" },
			{ label: "停车费", value: "停车费" },
			{ label: "水电费", value: "水电费" },
			{ label: "燃气费", value: "燃气费" },
			{ label: "暖气费", value: "暖气费" },
			{ label: "其他费用", value: "其他费用" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择费用项目",
		},
		required: true,
	},
	{
		label: "付费周期",
		prop: "paymentPeriod",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入付费周期，如：2024年Q1",
		},
		required: true,
	},
	{
		label: "缴费起始时间",
		prop: "paymentStartTime",
		valueType: "date-picker",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择缴费起始时间",
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
		required: true,
	},
	{
		label: "缴费结束时间",
		prop: "paymentEndTime",
		valueType: "date-picker",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择缴费结束时间",
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
		required: true,
	},
	{
		label: "应付金额",
		prop: "payableAmount",
		valueType: "input",
		width: "140px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入应付金额",
		},
		required: true,
	},
	{
		label: "实付金额",
		prop: "paidAmount",
		valueType: "input",
		width: "140px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入实付金额",
		},
		required: true,
	},
	{
		label: "操作员工",
		prop: "operator",
		valueType: "input",
		width: "140px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入操作员工姓名",
		},
		required: true,
	},
	{
		label: "缴费时间",
		prop: "paymentTime",
		valueType: "date-picker",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择缴费时间",
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	{
		label: "审核状态",
		prop: "auditStatus",
		valueType: "select",
		width: "140px",
		options: [
			{ label: "待审核", value: "待审核" },
			{ label: "审核通过", value: "审核通过" },
			{ label: "审核拒绝", value: "审核拒绝" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择审核状态",
		},
		required: true,
	},
	{
		label: "审核说明",
		prop: "auditDescription",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入审核说明",
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
	},
	{
		label: "缴费备注",
		prop: "paymentRemark",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入缴费备注",
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
	},
	{
		label: "详情",
		prop: "details",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入详细信息",
			rows: 4,
			maxlength: 1000,
			showWordLimit: true,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	house: [
		{ required: true, message: "请输入房屋编号", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	expenseItem: [{ required: true, message: "请选择费用项目", trigger: "change" }],
	paymentPeriod: [
		{ required: true, message: "请输入付费周期", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	paymentStartTime: [{ required: true, message: "请选择缴费起始时间", trigger: "change" }],
	paymentEndTime: [{ required: true, message: "请选择缴费结束时间", trigger: "change" }],
	payableAmount: [
		{ required: true, message: "请输入应付金额", trigger: "blur" },
		{ pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额格式", trigger: "blur" },
	],
	paidAmount: [
		{ required: true, message: "请输入实付金额", trigger: "blur" },
		{ pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额格式", trigger: "blur" },
	],
	operator: [
		{ required: true, message: "请输入操作员工姓名", trigger: "blur" },
		{ min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
	],
	paymentTime: [{ required: true, message: "请选择缴费时间", trigger: "change" }],
	auditStatus: [{ required: true, message: "请选择审核状态", trigger: "change" }],
	auditDescription: [{ max: 500, message: "审核说明长度不能超过 500 个字符", trigger: "blur" }],
	paymentRemark: [{ max: 500, message: "缴费备注长度不能超过 500 个字符", trigger: "blur" }],
	details: [{ max: 1000, message: "详情长度不能超过 1000 个字符", trigger: "blur" }],
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
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
