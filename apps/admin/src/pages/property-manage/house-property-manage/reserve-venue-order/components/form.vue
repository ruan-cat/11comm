<!--
  场地预约订单表单
  用于新增 修改场地预约订单
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { ReserveVenueOrderFormProps, ReserveVenueOrderFormVO, reservedVenueOptions, reserveVenueOrderStatusOptions } from "./form";

const props = defineProps<ReserveVenueOrderFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ReserveVenueOrderFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & ReserveVenueOrderFormVO;

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
	// 订单编号
	{
		label: "订单编号",
		prop: "orderNumber",
		valueType: "input",
		required: true,
	},

	// 场馆
	{
		label: "场馆",
		prop: "venue",
		valueType: "input",
		required: true,
	},

	// 场地
	{
		label: "场地",
		prop: "site",
		valueType: "select",
		options: reservedVenueOptions,
		required: true,
	},

	// 预约人
	{
		label: "预约人",
		prop: "reserver",
		valueType: "input",
		required: true,
	},

	// 预约电话
	{
		label: "预约电话",
		prop: "reservationPhone",
		valueType: "input",
		required: true,
	},

	// 预约日期
	{
		label: "预约日期",
		prop: "reservationDate",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
		required: true,
	},

	// 预约时间
	{
		label: "预约时间",
		prop: "reservationTime",
		valueType: "input",
		required: true,
	},

	// 应收金额
	{
		label: "应收金额",
		prop: "receivableAmount",
		valueType: "input",
		required: true,
	},

	// 实收金额
	{
		label: "实收金额",
		prop: "receivedAmount",
		valueType: "input",
		required: true,
	},

	// 支付方式
	{
		label: "支付方式",
		prop: "paymentMethod",
		valueType: "select",
		options: [
			{ label: "微信", value: "微信" },
			{ label: "支付宝", value: "支付宝" },
			{ label: "现金", value: "现金" },
			{ label: "银行卡", value: "银行卡" },
		],
		required: true,
	},

	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: reserveVenueOrderStatusOptions,
		required: true,
	},

	// 创建时间
	{
		label: "创建时间",
		prop: "createTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},

	// 备注
	{
		label: "备注",
		prop: "remark",
		valueType: "input",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	orderNumber: [
		{
			required: true,
			message: "请输入订单编号",
			trigger: "blur",
		},
	],
	venue: [
		{
			required: true,
			message: "请输入场馆",
			trigger: "blur",
		},
	],
	site: [
		{
			required: true,
			message: "请选择场地",
			trigger: "change",
		},
	],
	reserver: [
		{
			required: true,
			message: "请输入预约人",
			trigger: "blur",
		},
	],
	reservationPhone: [
		{
			required: true,
			message: "请输入预约电话",
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号格式",
			trigger: "blur",
		},
	],
	reservationDate: [
		{
			required: true,
			message: "请选择预约日期",
			trigger: "change",
		},
	],
	reservationTime: [
		{
			required: true,
			message: "请输入预约时间",
			trigger: "blur",
		},
	],
	receivableAmount: [
		{
			required: true,
			message: "请输入应收金额",
			trigger: "blur",
		},
	],
	receivedAmount: [
		{
			required: true,
			message: "请输入实收金额",
			trigger: "blur",
		},
	],
	paymentMethod: [
		{
			required: true,
			message: "请选择支付方式",
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: "请选择状态",
			trigger: "change",
		},
	],
	createTime: [
		{
			required: true,
			message: "请选择创建时间",
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
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
