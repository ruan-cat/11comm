<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { PhoneRepairsFormProps, 电话报修表单_VO, defaultForm } from "./form";

const props = defineProps<PhoneRepairsFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 电话报修表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 电话报修表单_VO;

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
	// 报修范围
	{
		label: "报修范围",
		prop: "报修范围",
		valueType: "select",
		options: [
			{ label: "1", value: "1" },
			{ label: "2", value: "2" },
		],
		required: true,
	},

	// 报修类型
	{
		label: "报修类型",
		prop: "报修类型",
		valueType: "select",
		options: [
			{ label: "1", value: "1" },
			{ label: "2", value: "2" },
		],
		required: true,
	},

	// 报修人
	{
		label: "报修人",
		prop: "报修人",
		valueType: "input",
		required: true,
	},
	// 联系方式
	{
		label: "联系方式",
		prop: "联系方式",
		valueType: "input",
		required: true,
	},
	// 预约时间
	{
		label: "预约时间",
		prop: "预约时间",
		valueType: "date-picker",
		required: true,
	},
	// 报修内容
	{
		label: "报修内容",
		prop: "报修内容",
		valueType: "textarea",
		required: true,
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
		class="form-root"
		:has-footer="false"
		v-model="form"
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
