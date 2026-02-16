<script lang="ts" setup>
import { useTemplateRef, ref, computed } from "vue";
import type { OverduePaymentInformationFormVO } from "@01s-11comm/type";
import { chargeObjectOptions, overduePaymentStatusOptions } from "@01s-11comm/type";

import { OverduePaymentInformationFormProps } from "./form";

/** 表单组件的 props */
const props = defineProps<OverduePaymentInformationFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OverduePaymentInformationFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & OverduePaymentInformationFormVO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递，扩展欠费时间范围字段
 */
const form = ref({
	...toRefForm,
	overdueTimeRange: toRefForm.startTime && toRefForm.endTime ? [toRefForm.startTime, toRefForm.endTime] : ["", ""],
});

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return {
		...form.value,
		startTime: form.value.overdueTimeRange?.[0] || "",
		endTime: form.value.overdueTimeRange?.[1] || "",
	};
});

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "收费对象",
		prop: "chargeObject",
		valueType: "select",
		options: chargeObjectOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		width: "200px",
	},
	{
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入业主姓名",
		},
		width: "200px",
	},
	{
		label: "手机号",
		prop: "phoneNumber",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入手机号码",
		},
		width: "200px",
	},
	{
		label: "联系地址",
		prop: "contactAddress",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入详细地址",
		},
		width: "300px",
	},
	{
		label: "欠费时间范围",
		prop: "overdueTimeRange",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			startPlaceholder: "开始日期",
			endPlaceholder: "结束日期",
		},
		width: "280px",
	},
	{
		label: "欠费金额",
		prop: "overdueAmount",
		valueType: "input-number",
		fieldProps: {
			precision: 2,
			min: 0,
			placeholder: "请输入欠费金额",
		},
		width: "200px",
	},
	{
		label: "缴费状态",
		prop: "paymentStatus",
		valueType: "select",
		options: overduePaymentStatusOptions,
		fieldProps: {
			clearable: true,
		},
		width: "150px",
	},
	{
		label: "欠费说明",
		prop: "overdueDescription",
		valueType: "textarea",
		fieldProps: {
			placeholder: "请输入欠费说明",
			rows: 3,
			maxlength: 200,
			showWordLimit: true,
		},
		width: "400px",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	chargeObject: [{ required: true, message: "请选择收费对象", trigger: "change" }],
	ownerName: [
		{ required: true, message: "请输入业主名称", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	phoneNumber: [
		{ required: true, message: "请输入手机号", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	overdueTimeRange: [{ required: true, message: "请选择欠费时间范围", trigger: "change" }],
	overdueAmount: [{ required: true, message: "请输入欠费金额", trigger: "blur" }],
	paymentStatus: [{ required: true, message: "请选择缴费状态", trigger: "change" }],
});

// 默认导出，供外部使用
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
