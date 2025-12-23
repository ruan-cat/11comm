<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { invoiceTypeOptions } from "@01s-11comm/type";
import { type InvoiceTitleFormProps } from "./form";
import type { InvoiceTitleFormVO } from "@01s-11comm/type";

/** 表单组件props */
const props = defineProps<InvoiceTitleFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & InvoiceTitleFormVO;

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
const toRefForm = structuredClone(props.form) as InvoiceTitleFormVO;

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
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入业主名称",
		},
	},
	{
		label: "发票类型",
		prop: "invoiceType",
		valueType: "select",
		options: invoiceTypeOptions,
		fieldProps: {
			placeholder: "请选择发票类型",
		},
	},
	{
		label: "发票名头",
		prop: "invoiceTitle",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入发票名头",
		},
	},
	{
		label: "纳税人识别号",
		prop: "taxpayerId",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入纳税人识别号",
		},
	},
	{
		label: "地址",
		prop: "address",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入地址",
		},
	},
	{
		label: "电话",
		prop: "phone",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入电话",
		},
	},
	{
		label: "开户行及账号",
		prop: "bankAccount",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入开户行及账号",
		},
	},
	{
		label: "备注",
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			placeholder: "请输入备注信息",
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	ownerName: [
		{
			required: true,
			message: "请输入业主名称",
			trigger: "blur",
		},
	],
	invoiceType: [
		{
			required: true,
			message: "请选择发票类型",
			trigger: "change",
		},
	],
	invoiceTitle: [
		{
			required: true,
			message: "请输入发票名头",
			trigger: "blur",
		},
	],
	taxpayerId: [
		{
			required: true,
			message: "请输入纳税人识别号",
			trigger: "blur",
		},
		{
			pattern: /^[A-Z0-9]{15,20}$/,
			message: "纳税人识别号格式不正确",
			trigger: "blur",
		},
	],
});

// 默认导出表单实例和计算属性
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
