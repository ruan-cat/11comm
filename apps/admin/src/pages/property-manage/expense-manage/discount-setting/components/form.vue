<!--
  折扣设置表单
  用于新增 修改折扣设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { DiscountSettingFormProps, 折扣设置表单_VO, defaultForm } from "./form";

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
		required: true, //是否必填
	},

	// 折扣类型
	{
		label: "折扣类型",
		prop: "折扣类型",
		valueType: "select",
		options: [
			{ label: "优惠", value: "优惠" },
			{ label: "违约", value: "违约" },
			{ label: "优惠（需要申请）", value: "优惠（需要申请）" },
		],
		required: true,
	},

	// 规则
	{
		label: "规则",
		prop: "规则",
		valueType: "select",
		options: [
			{ label: "规则1", value: "规则1" },
			{ label: "规则2", value: "规则2" },
		],
		required: true,
	},

	// 描述
	{
		label: "描述",
		prop: "描述",
		valueType: "textarea",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验 */
const plusFormRules = {};

defineExpose({
	plusFormInstance,
	formComputed,
});
</script>

<template>
	<PlusForm
		ref="plusFormRef"
		v-model="form"
		class="form-root"
		:has-footer="false"
		:default-values="defaultValues"
		:columns="plusFormColumnsComputed"
		:rules="plusFormRules"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
