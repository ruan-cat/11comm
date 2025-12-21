<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { InitializeCellFormProps, defaultForm, type 初始化单元格表单_VO, cellTypeOptions, 状态Options } from "./form";

/** 表单组件的 props */
const props = defineProps<InitializeCellFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 初始化单元格表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 初始化单元格表单_VO;

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
		label: "单元格名称",
		prop: "单元格名称",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入单元格名称",
		},
	},
	{
		label: "单元格类型",
		prop: "单元格类型",
		valueType: "select",
		options: cellTypeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择单元格类型",
		},
	},
	{
		label: "建筑物ID",
		prop: "建筑物ID",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入建筑物ID",
		},
	},
	{
		label: "建筑物名称",
		prop: "建筑物名称",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入建筑物名称",
		},
	},
	{
		label: "楼层",
		prop: "楼层",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入楼层信息，如：1-18层",
		},
	},
	{
		label: "单元号",
		prop: "单元号",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入单元号，如：1单元",
		},
	},
	{
		label: "户数",
		prop: "户数",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			max: 1000,
			placeholder: "请输入户数",
		},
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态Options,
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},
	{
		label: "描述",
		prop: "描述",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			placeholder: "请输入描述信息",
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	单元格名称: [
		{ required: true, message: "请填写单元格名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	单元格类型: [{ required: true, message: "请选择单元格类型", trigger: "change" }],
	建筑物ID: [
		{ required: true, message: "请输入建筑物ID", trigger: "blur" },
		{ pattern: /^[A-Z0-9]+$/, message: "建筑物ID只能包含大写字母和数字", trigger: "blur" },
	],
	建筑物名称: [
		{ required: true, message: "请输入建筑物名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	楼层: [
		{ required: true, message: "请输入楼层信息", trigger: "blur" },
		{ min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" },
	],
	单元号: [
		{ required: true, message: "请输入单元号", trigger: "blur" },
		{ min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
	],
	户数: [
		{ required: true, message: "请输入户数", trigger: "blur" },
		{ type: "number", min: 1, max: 1000, message: "户数必须在 1 到 1000 之间", trigger: "blur" },
	],
	状态: [{ required: true, message: "请选择状态", trigger: "change" }],
	描述: [{ max: 200, message: "描述长度不能超过 200 个字符", trigger: "blur" }],
});

// 默认对外导出
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
