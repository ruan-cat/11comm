<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useTemplateRef } from "vue";
import { CancelFeeFormProps, defaultForm, type 取消费用表单_VO } from "./form";
import { 审核状态Options } from "../test-data";

const props = defineProps<CancelFeeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 取消费用表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 取消费用表单_VO;

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
		label: "批次号",
		prop: "批次号",
		valueType: "input",
	},
	{
		label: "员工",
		prop: "员工",
		valueType: "input",
	},
	{
		label: "时间",
		prop: "时间",
		valueType: "input",
	},
	{
		label: "取消原因",
		prop: "取消原因",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},
	{
		label: "审核状态",
		prop: "审核状态",
		valueType: "select",
		options: 审核状态Options,
	},
	{
		label: "审核意见",
		prop: "审核意见",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	审核状态: [
		{
			required: true,
			message: "请选择审核状态",
			trigger: "change",
		},
	],
	审核意见: [
		{
			required: true,
			message: "请输入审核意见",
			trigger: "blur",
		},
	],
};

// 暴露给父组件使用的变量和方法
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
