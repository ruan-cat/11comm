<!--
  菜单组表单
  用于新增/修改菜单组
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { 菜单组表单Props, 菜单组表单_VO, defaultForm, 组类型选项, 状态选项, 商户选项, 图标选项 } from "./form";

const props = defineProps<菜单组表单Props>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 菜单组表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 菜单组表单_VO;

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
	// 组编号
	{
		label: "组编号",
		prop: "组编号",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入组编号，如：GROUP001",
		},
	},

	// 组名称
	{
		label: "组名称",
		prop: "组名称",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入组名称",
		},
	},

	// 组编码
	{
		label: "组编码",
		prop: "组编码",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入组编码，如：SYSTEM_MANAGE",
		},
	},

	// 组类型
	{
		label: "组类型",
		prop: "组类型",
		valueType: "select",
		width: "180px",
		required: true,
		options: 组类型选项,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择组类型",
		},
	},

	// 归属商户
	{
		label: "归属商户",
		prop: "归属商户",
		valueType: "select",
		width: "180px",
		required: true,
		options: 商户选项,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择归属商户",
		},
	},

	// 显示顺序
	{
		label: "显示顺序",
		prop: "排序",
		valueType: "input-number",
		width: "150px",
		required: true,
		fieldProps: {
			min: 1,
			max: 9999,
			placeholder: "请输入显示顺序",
		},
	},

	// 图标
	{
		label: "图标",
		prop: "图标",
		valueType: "select",
		width: "200px",
		required: true,
		options: 图标选项,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择图标",
		},
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		width: "150px",
		required: true,
		options: 状态选项,
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},

	// 描述
	{
		label: "描述",
		prop: "描述",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入菜单组描述信息",
			rows: 3,
			maxlength: 200,
			showWordLimit: true,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	组编号: [
		{ required: true, message: "请输入组编号", trigger: "blur" },
		{ min: 3, max: 20, message: "组编号长度在 3 到 20 个字符", trigger: "blur" },
		{ pattern: /^[A-Z0-9_]+$/, message: "组编号只能包含大写字母、数字和下划线", trigger: "blur" },
	],
	组名称: [
		{ required: true, message: "请输入组名称", trigger: "blur" },
		{ min: 2, max: 50, message: "组名称长度在 2 到 50 个字符", trigger: "blur" },
	],
	组编码: [
		{ required: true, message: "请输入组编码", trigger: "blur" },
		{ min: 3, max: 50, message: "组编码长度在 3 到 50 个字符", trigger: "blur" },
		{ pattern: /^[A-Z_]+$/, message: "组编码只能包含大写字母和下划线", trigger: "blur" },
	],
	组类型: [{ required: true, message: "请选择组类型", trigger: "change" }],
	归属商户: [{ required: true, message: "请选择归属商户", trigger: "change" }],
	排序: [
		{ required: true, message: "请输入显示顺序", trigger: "blur" },
		{ type: "number", min: 1, max: 9999, message: "显示顺序必须在 1-9999 之间", trigger: "blur" },
	],
	图标: [{ required: true, message: "请选择图标", trigger: "change" }],
	状态: [{ required: true, message: "请选择状态", trigger: "change" }],
	描述: [
		{ max: 200, message: "描述长度不能超过 200 个字符", trigger: "blur" },
	],
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