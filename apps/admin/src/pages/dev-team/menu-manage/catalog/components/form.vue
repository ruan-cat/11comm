<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { CatalogFormProps, defaultForm } from "./form";
import { 菜单目录表单_VO, 组类型选项, 归属商户选项 } from "./form";

/** 表单组件的 props */
const props = defineProps<CatalogFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 菜单目录表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 菜单目录表单_VO;

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
		label: "菜单组名称",
		prop: "name",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "图标",
		prop: "icon",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "标签",
		prop: "label",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "序列",
		prop: "seq",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			max: 999,
		},
	},
	{
		label: "组类型",
		prop: "groupType",
		valueType: "select",
		options: 组类型选项,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: "归属商户",
		prop: "storeType",
		valueType: "select",
		options: 归属商户选项,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: "描述",
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	name: [
		{ required: true, message: "请输入菜单组名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	icon: [
		{ required: true, message: "请输入图标", trigger: "blur" },
	],
	label: [
		{ required: true, message: "请输入标签", trigger: "blur" },
	],
	seq: [
		{ required: true, message: "请输入序列", trigger: "blur" },
		{ type: "number", min: 0, max: 999, message: "序列必须在0-999之间", trigger: "blur" },
	],
	groupType: [
		{ required: true, message: "请选择组类型", trigger: "change" },
	],
	storeType: [
		{ required: true, message: "请选择归属商户", trigger: "change" },
	],
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