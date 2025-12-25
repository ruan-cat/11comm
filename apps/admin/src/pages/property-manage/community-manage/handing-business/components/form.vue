<!--
  业务受理表单
  用于新增、修改业务受理
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import type { HandingBusinessFormProps } from "./form";
import type { HandingBusinessFormVO } from "@01s-11comm/type";
import { businessHandlingStatusOptions, feeTypeOptions } from "@01s-11comm/type";

const props = defineProps<HandingBusinessFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & HandingBusinessFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & HandingBusinessFormVO;

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
	// 费用项目
	{
		label: "费用项目",
		prop: "feeItem",
		valueType: "input",
		required: true,
	},

	// 费用标识
	{
		label: "费用标识",
		prop: "feeId",
		valueType: "input",
		required: true,
	},

	// 费用类型
	{
		label: "费用类型",
		prop: "feeType",
		valueType: "select",
		required: true,
		options: feeTypeOptions,
	},

	// 应收金额
	{
		label: "应收金额",
		prop: "amountReceivable",
		valueType: "input",
		required: true,
	},

	// 建账时间
	{
		label: "建账时间",
		prop: "accountCreationTime",
		valueType: "date-picker",
		required: true,
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	// 应收时间段
	{
		label: "应收时间段",
		prop: "receivablePeriod",
		valueType: "input",
		required: true,
	},

	// 说明
	{
		label: "说明",
		prop: "description",
		valueType: "textarea",
		required: true,
	},

	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		required: true,
		options: businessHandlingStatusOptions,
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	feeItem: [{ required: true, message: "请输入费用项目", trigger: "blur" }],
	feeId: [{ required: true, message: "请输入费用标识", trigger: "blur" }],
	feeType: [{ required: true, message: "请选择费用类型", trigger: "change" }],
	amountReceivable: [
		{ required: true, message: "请输入应收金额", trigger: "blur" },
		{ pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额格式", trigger: "blur" },
	],
	accountCreationTime: [{ required: true, message: "请选择建账时间", trigger: "change" }],
	receivablePeriod: [{ required: true, message: "请输入应收时间段", trigger: "blur" }],
	description: [{ required: true, message: "请输入说明", trigger: "blur" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

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
