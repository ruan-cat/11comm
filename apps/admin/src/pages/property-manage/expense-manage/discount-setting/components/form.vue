<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { DiscountSettingFormProps, 折扣设置表单_VO, defaultForm } from "./form";
import { 折扣类型Options, 规则Options } from "../test-data";

const props = defineProps<DiscountSettingFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 折扣设置表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 折扣设置表单_VO;

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
	// 折扣名称
	{
		label: "折扣名称",
		prop: "折扣名称",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},

	// 折扣类型
	{
		label: "折扣类型",
		prop: "折扣类型",
		valueType: "select",
		options: 折扣类型Options,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	// 规则
	{
		label: "规则",
		prop: "规则",
		valueType: "select",
		options: 规则Options,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	// 描述
	{
		label: "描述",
		prop: "描述",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	折扣名称: [
		{ required: true, message: "请输入折扣名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	折扣类型: [{ required: true, message: "请选择折扣类型", trigger: "change" }],
	规则: [{ required: true, message: "请选择规则", trigger: "change" }],
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
