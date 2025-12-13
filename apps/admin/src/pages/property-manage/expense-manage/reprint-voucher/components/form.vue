<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { type ReprintVoucherFormProps, defaultForm } from "./form";

/** 表单组件的 props */
const props = defineProps<ReprintVoucherFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 补打收据表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 补打收据表单_VO;

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
		label: "收据编号",
		prop: "收据编号",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: "费用类型",
		prop: "费用类型",
		valueType: "select",
		options: 费用类型Options,
		fieldProps: {
			disabled: true,
			clearable: true,
			filterable: true,
		},
	},
	{
		label: "费用项",
		prop: "费用项",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: "房屋",
		prop: "房屋",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: "业主",
		prop: "业主",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: "车位",
		prop: "车位",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: "总金额",
		prop: "总金额",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: "缴费时间",
		prop: "缴费时间",
		valueType: "input",
		fieldProps: {
			disabled: true,
			clearable: true,
		},
	},
	{
		label: "打印份数",
		prop: "打印份数",
		valueType: "input-number",
		fieldProps: {
			min: 1,
			max: 10,
		},
	},
	{
		label: "打印备注",
		prop: "打印备注",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			clearable: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	打印份数: [
		{
			required: true,
			message: "请输入打印份数",
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			max: 10,
			message: "打印份数必须在1-10之间",
			trigger: "blur",
		},
	],
	打印备注: [
		{
			max: 200,
			message: "打印备注不能超过200个字符",
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
