<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import type { InvoiceFormVO } from "@01s-11comm/type";
import { invoiceTypeOptions, invoiceAuditStatusOptions } from "@01s-11comm/type";
import { InvoiceFormProps } from "./form";

/** 表单组件的 props */
const props = defineProps<InvoiceFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & InvoiceFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

/** 表单重设 */
usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = structuredClone(props.form) as FieldValues & InvoiceFormVO;

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
		label: "编号",
		prop: "code",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "发票类型",
		prop: "invoiceType",
		valueType: "select",
		options: invoiceTypeOptions,
	},
	{
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: "申请人",
		prop: "applicant",
		valueType: "input",
	},
	{
		label: "发票名头",
		prop: "invoiceTitle",
		valueType: "input",
	},
	{
		label: "纳税人识别号",
		prop: "taxpayerId",
		valueType: "input",
	},
	{
		label: "申请金额",
		prop: "applicationAmount",
		valueType: "input",
	},
	{
		label: "发票号",
		prop: "invoiceNumber",
		valueType: "input",
	},
	{
		label: "审核状态",
		prop: "auditStatus",
		valueType: "select",
		options: invoiceAuditStatusOptions,
	},
	{
		label: "申请时间",
		prop: "applicationTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	invoiceType: [
		{
			required: true,
			message: "请选择发票类型",
			trigger: "change",
		},
	],
	ownerName: [
		{
			required: true,
			message: "请输入业主名称",
			trigger: "blur",
		},
	],
	applicant: [
		{
			required: true,
			message: "请输入申请人",
			trigger: "blur",
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
	],
	applicationAmount: [
		{
			required: true,
			message: "请输入申请金额",
			trigger: "blur",
		},
	],
	invoiceNumber: [
		{
			required: true,
			message: "请输入发票号",
			trigger: "blur",
		},
	],
});

/** 对外导出表单实例和表单对象 */
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
