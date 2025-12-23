<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import type { ArrearsDetailsFormProps } from "./form";

const props = defineProps<ArrearsDetailsFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ArrearsDetailsFormProps["form"];

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
const toRefForm = structuredClone(props.form) as FieldValues & ArrearsDetailsFormProps["form"];

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
		label: "费用编号",
		prop: "feeNumber",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "房号",
		prop: "roomNumber",
		valueType: "input",
	},
	{
		label: "业主",
		prop: "owner",
		valueType: "input",
	},
	{
		label: "业主电话",
		prop: "ownerPhone",
		valueType: "input",
	},
	{
		label: "面积",
		prop: "area",
		valueType: "input",
	},
	{
		label: "费用项",
		prop: "feeItem",
		valueType: "input",
	},
	{
		label: "开始时间",
		prop: "startTime",
		valueType: "date-picker",
	},
	{
		label: "结束时间",
		prop: "endTime",
		valueType: "date-picker",
	},
	{
		label: "欠费时长",
		prop: "arrearsDuration",
		valueType: "input",
	},
	{
		label: "欠费金额",
		prop: "arrearsAmount",
		valueType: "input",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	roomNumber: [{ required: true, message: "请输入房号", trigger: "blur" }],
	owner: [{ required: true, message: "请输入业主", trigger: "blur" }],
	ownerPhone: [{ required: true, message: "请输入业主电话", trigger: "blur" }],
	feeItem: [{ required: true, message: "请输入费用项", trigger: "blur" }],
	startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
	arrearsAmount: [{ required: true, message: "请输入欠费金额", trigger: "blur" }],
});

/** 动态计算的表单项配置 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 对外导出 */
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
