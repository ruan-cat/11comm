<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { type OwnerAccountFormProps, 账户类型选项, 支付方式选项 } from "./form";
import { type 业主账户表单_VO } from "../test-data";

/** 表单组件props */
const props = defineProps<OwnerAccountFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 业主账户表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 业主账户表单_VO;

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
		label: "账户类型",
		prop: "账户类型",
		valueType: "select",
		options: 账户类型选项,
		fieldProps: {
			placeholder: "请选择账户类型",
		},
	},
	{
		label: "业主手机",
		prop: "业主手机",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入业主手机号",
		},
	},
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入业主名称",
		},
	},
	{
		label: "预存金额",
		prop: "预存金额",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入预存金额",
		},
	},
	{
		label: "支付方式",
		prop: "支付方式",
		valueType: "select",
		options: 支付方式选项,
		fieldProps: {
			placeholder: "请选择支付方式",
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
	账户类型: [
		{
			required: true,
			message: "请选择账户类型",
			trigger: "change",
		},
	],
	业主手机: [
		{
			required: true,
			message: "请输入业主手机号",
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号格式",
			trigger: "blur",
		},
	],
	业主名称: [
		{
			required: true,
			message: "请输入业主名称",
			trigger: "blur",
		},
	],
	预存金额: [
		{
			required: true,
			message: "请输入预存金额",
			trigger: "blur",
		},
		{
			pattern: /^\d+(\.\d{1,2})?$/,
			message: "请输入正确的金额格式",
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
