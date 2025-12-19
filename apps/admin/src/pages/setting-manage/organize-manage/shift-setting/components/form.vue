<!--
  班次设置表单
  用于新增 修改班次设置
-->
<script lang="ts" setup>
import { useTemplateRef, computed, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";

import { type ShiftSettingFormProps, type ShiftSettingFormVO } from "./form";
import { shiftTypeOptions } from "@01s-11comm/type";

const props = defineProps<ShiftSettingFormProps & { mode: Mode }>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ShiftSettingFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & ShiftSettingFormVO;

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
		prop: "name",
		valueType: "input",
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: "班次类型",
		prop: "type",
		valueType: "select",
		options: shiftTypeOptions,
		required: true,
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: "开始时间",
		prop: "startTime",
		valueType: "time-picker",
		required: true,
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
			disabled: props.mode === "info",
		},
	},
	{
		label: "结束时间",
		prop: "endTime",
		valueType: "time-picker",
		required: true,
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
			disabled: props.mode === "info",
		},
	},
	{
		label: "是否启用",
		prop: "enabled",
		valueType: "switch",
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
	{
		label: "描述",
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			disabled: props.mode === "info",
		},
	},
]);

// 表单验证规则
const plusFormRules = ref<PlusFormRules>({
	name: [{ required: true, message: "请输入班次名称", trigger: "blur" }],
	type: [{ required: true, message: "请选择班次类型", trigger: "change" }],
	startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
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
