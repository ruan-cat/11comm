<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { type InvoiceTitleFormProps, defaultForm, 发票类型选项 } from "./form";
import { type 发票抬头表单_VO } from "../test-data";

/** 表单组件props */
const props = defineProps<InvoiceTitleFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 发票抬头表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 发票抬头表单_VO;

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
		prop: "业主名称",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入业主名称",
		},
	},
	{
		label: "发票类型",
		prop: "发票类型",
		valueType: "select",
		options: 发票类型选项,
		fieldProps: {
			placeholder: "请选择发票类型",
		},
	},
	{
		label: "发票名头",
		prop: "发票名头",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入发票名头",
		},
	},
	{
		label: "纳税人识别号",
		prop: "纳税人识别号",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入纳税人识别号",
		},
	},
	{
		label: "地址",
		prop: "地址",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入地址",
		},
	},
	{
		label: "电话",
		prop: "电话",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入电话",
		},
	},
	{
		label: "开户行及账号",
		prop: "开户行及账号",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入开户行及账号",
		},
	},
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
		fieldProps: {
			placeholder: "请输入备注信息",
			rows: 3,
		},
	},
]);

/** 表单验证规则 */
const plusFormRules = {
	业主名称: [
		{
			required: true,
			message: "请输入业主名称",
			trigger: "blur",
		},
	],
	发票类型: [
		{
			required: true,
			message: "请选择发票类型",
			trigger: "change",
		},
	],
	发票名头: [
		{
			required: true,
			message: "请输入发票名头",
			trigger: "blur",
		},
	],
	纳税人识别号: [
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
};

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