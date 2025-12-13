<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { CarportInfoFormProps } from "./form";

/** 表单组件的 props */
const props = defineProps<CarportInfoFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 车位信息_表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 车位信息_表单_VO;

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
		label: "停车场",
		prop: "停车场",
		valueType: "select",
		options: 停车场Options,
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "车位编号",
		prop: "车位",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入车位编号",
		},
	},
	{
		label: "车位状态",
		prop: "车位状态",
		valueType: "select",
		options: 车位状态Options,
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "车位类型",
		prop: "车位类型",
		valueType: "select",
		options: 车位类型Options,
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "面积",
		prop: "面积",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入车位面积",
		},
	},
	{
		label: "业主姓名",
		prop: "业主姓名",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入业主姓名",
		},
	},
	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入联系电话",
		},
	},
	{
		label: "车辆号码",
		prop: "车辆号码",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入车辆号码",
		},
	},
	{
		label: "购买日期",
		prop: "购买日期",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			placeholder: "请选择购买日期",
		},
	},
	{
		label: "到期日期",
		prop: "到期日期",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			placeholder: "请选择到期日期",
		},
	},
	{
		label: "月租费用",
		prop: "月租费用",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			precision: 2,
			placeholder: "请输入月租费用",
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

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	停车场: [
		{
			required: true,
			message: "请选择停车场",
			trigger: "change",
		},
	],
	车位: [
		{
			required: true,
			message: "请输入车位编号",
			trigger: "blur",
		},
	],
	车位状态: [
		{
			required: true,
			message: "请选择车位状态",
			trigger: "change",
		},
	],
	车位类型: [
		{
			required: true,
			message: "请选择车位类型",
			trigger: "change",
		},
	],
	面积: [
		{
			required: true,
			message: "请输入车位面积",
			trigger: "blur",
		},
	],
	联系电话: [
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号格式",
			trigger: "blur",
		},
	],
	月租费用: [
		{
			type: "number",
			min: 0,
			message: "月租费用需大于等于0",
			trigger: "blur",
		},
	],
});

/** 默认对外导出 */
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
