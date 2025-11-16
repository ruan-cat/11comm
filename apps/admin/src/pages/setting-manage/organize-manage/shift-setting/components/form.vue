<!--
  班次设置表单
  用于新增 修改班次设置
-->
<script lang="ts" setup>
import { ref, computed, reactive, useTemplateRef } from "vue";

import { ShiftSettingFormProps, 班次设置表单_VO } from "./form";

const props = defineProps<ShiftSettingFormProps & { mode: Mode }>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 班次设置表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 班次设置表单_VO;

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
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: "班次名称",
		prop: "班次名称",
		valueType: "input",
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: "时段",
		prop: "时段",
		valueType: "input",
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: [
			{ label: "启用", value: "启用" },
			{ label: "停止", value: "停止" },
		],
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: "备注说明",
		prop: "备注说明",
		valueType: "textarea",
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
]);

// 表单验证规则
const plusFormRules = ref<PlusFormRules>({
	班次名称: [{ required: true, message: "请输入班次名称", trigger: "blur" }],
	时段: [{ required: true, message: "请输入时段", trigger: "blur" }],
	状态: [{ required: true, message: "请选择状态", trigger: "change" }],
});

// 对外导出表单实例和表单对象
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
