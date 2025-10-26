<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { InvoiceFormProps, type 发票表单_VO } from "./form";

/** 表单组件的 props */
const props = defineProps<InvoiceFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 发票表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 发票表单_VO;

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
		prop: "编号",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "发票类型",
		prop: "发票类型",
		valueType: "select",
		options: [
			{ label: "增值税普通发票", value: "增值税普通发票" },
			{ label: "增值税专用发票", value: "增值税专用发票" },
			{ label: "电子发票", value: "电子发票" },
		],
	},
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
	},
	{
		label: "申请人",
		prop: "申请人",
		valueType: "input",
	},
	{
		label: "发票名头",
		prop: "发票名头",
		valueType: "input",
	},
	{
		label: "纳税人识别号",
		prop: "纳税人识别号",
		valueType: "input",
	},
	{
		label: "申请金额",
		prop: "申请金额",
		valueType: "input",
	},
	{
		label: "发票号",
		prop: "发票号",
		valueType: "input",
	},
	{
		label: "发审核状态",
		prop: "发审核状态",
		valueType: "select",
		options: [
			{ label: "待审核", value: "待审核" },
			{ label: "已通过", value: "已通过" },
			{ label: "已驳回", value: "已驳回" },
		],
	},
	{
		label: "申请时间",
		prop: "申请时间",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
	},
]);

/** 表单验证规则 */
const plusFormRules = {
	发票类型: [
		{
			required: true,
			message: "请选择发票类型",
		},
	],
	业主名称: [
		{
			required: true,
			message: "请输入业主名称",
		},
	],
	申请人: [
		{
			required: true,
			message: "请输入申请人",
		},
	],
	发票名头: [
		{
			required: true,
			message: "请输入发票名头",
		},
	],
	纳税人识别号: [
		{
			required: true,
			message: "请输入纳税人识别号",
		},
	],
	申请金额: [
		{
			required: true,
			message: "请输入申请金额",
		},
	],
	发票号: [
		{
			required: true,
			message: "请输入发票号",
		},
	],
};

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