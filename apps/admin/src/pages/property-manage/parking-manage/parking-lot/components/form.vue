<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { 停车场表单Props, 停车场表单_VO, defaultForm, 停车场类型Options, 车位类型Options } from "./form";

const props = defineProps<停车场表单Props & { mode: Mode }>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 停车场表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 停车场表单_VO;

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
	// 停车场编号
	{
		label: "停车场编号",
		prop: "停车场编号",
		valueType: "input",
		required: true,
	},

	// 停车场类型
	{
		label: "停车场类型",
		prop: "停车场类型",
		valueType: "select",
		required: true,
		options: 停车场类型Options,
	},

	// 车位类型
	{
		label: "车位类型",
		prop: "车位类型",
		valueType: "select",
		required: true,
		options: 车位类型Options,
	},

	// 外部编码
	{
		label: "外部编码",
		prop: "外部编码",
		valueType: "input",
		required: true,
	},

	// 备注
	{
		label: "备注",
		prop: "备注",
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
	<section class="form-root">
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			:has-footer="false"
			:default-values="defaultValues"
			:columns="plusFormColumnsComputed"
			:rules="plusFormRules"
			:label-width="100"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>