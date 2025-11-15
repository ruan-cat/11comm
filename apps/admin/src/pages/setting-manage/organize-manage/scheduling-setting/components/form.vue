<script lang="ts" setup>
import { useTemplateRef, computed, ref, reactive } from "vue";
import type { FormItemRule } from "element-plus";
import { 排班类型Options, 状态Options, type SchedulingSettingFormProps, type 排班设置表单_VO } from "./form";

const props = defineProps<SchedulingSettingFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 排班设置表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 排班设置表单_VO;

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
		label: "班次名称",
		prop: "班次名称",
		valueType: "input",
	},
	{
		label: "排班类型",
		prop: "排班类型",
		valueType: "select",
		options: 排班类型Options,
	},
	{
		label: "排班周期",
		prop: "排班周期",
		valueType: "input-number",
		fieldProps: {
			min: 1,
		},
	},
	{
		label: "生效时间",
		prop: "生效时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: "人员",
		prop: "人员",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态Options,
	},
]);

/** 表单验证规则 */
const plusFormRules = reactive({
	班次名称: [
		{ required: true, message: "请输入班次名称", trigger: "blur" } as FormItemRule,
	],
	排班类型: [
		{ required: true, message: "请选择排班类型", trigger: "change" } as FormItemRule,
	],
	排班周期: [
		{ required: true, message: "请输入排班周期", trigger: "blur" } as FormItemRule,
		{ type: "number", min: 1, message: "排班周期必须大于0", trigger: "blur" } as FormItemRule,
	],
	生效时间: [
		{ required: true, message: "请选择生效时间", trigger: "change" } as FormItemRule,
	],
	状态: [
		{ required: true, message: "请选择状态", trigger: "change" } as FormItemRule,
	],
});

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