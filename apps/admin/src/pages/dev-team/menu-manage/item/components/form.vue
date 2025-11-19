<!--
  菜单项表单
  用于新增、修改菜单项
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { MenuItemFormProps, 菜单项表单_VO, defaultForm, 菜单类型, 状态选项, 是否选项 } from "./form";

const props = defineProps<MenuItemFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 菜单项表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 菜单项表单_VO;

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
	// 菜单名称
	{
		label: "菜单名称",
		prop: "菜单名称",
		valueType: "input",
		required: true,
		fieldProps: {
			placeholder: "请输入菜单名称",
			clearable: true,
		},
		width: "200px",
	},

	// 父级菜单
	{
		label: "父级菜单",
		prop: "父级菜单",
		valueType: "select",
		required: true,
		options: [
			{ label: "根菜单", value: "根菜单" },
			{ label: "系统管理", value: "系统管理" },
			{ label: "监控管理", value: "监控管理" },
			{ label: "系统工具", value: "系统工具" },
			{ label: "日志管理", value: "日志管理" },
			{ label: "系统设置", value: "系统设置" },
		],
		fieldProps: {
			placeholder: "请选择父级菜单",
			clearable: true,
		},
		width: "200px",
	},

	// 菜单类型
	{
		label: "菜单类型",
		prop: "菜单类型",
		valueType: "select",
		required: true,
		options: [
			{ label: "目录", value: "目录" },
			{ label: "菜单", value: "菜单" },
			{ label: "按钮", value: "按钮" },
			{ label: "接口", value: "接口" },
		],
		fieldProps: {
			placeholder: "请选择菜单类型",
			clearable: true,
		},
		width: "150px",
	},

	// 菜单图标
	{
		label: "菜单图标",
		prop: "图标",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入图标类名，如：mdi:home",
			clearable: true,
		},
		width: "200px",
	},

	// 路由路径
	{
		label: "路由路径",
		prop: "路由路径",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入路由路径，如：/system/user",
			clearable: true,
		},
		width: "250px",
		hidden: (formData) => formData.菜单类型 === "按钮" || formData.菜单类型 === "接口",
	},

	// 组件路径
	{
		label: "组件路径",
		prop: "组件路径",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入组件路径，如：/pages/system/user/index",
			clearable: true,
		},
		width: "250px",
		hidden: (formData) => formData.菜单类型 === "按钮" || formData.菜单类型 === "接口" || formData.菜单类型 === "目录",
	},

	// 权限标识
	{
		label: "权限标识",
		prop: "权限标识",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入权限标识，如：system:user:list",
			clearable: true,
		},
		width: "250px",
	},

	// 显示顺序
	{
		label: "显示顺序",
		prop: "排序",
		valueType: "input-number",
		fieldProps: {
			placeholder: "请输入显示顺序",
			min: 1,
			max: 999,
		},
		width: "150px",
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		required: true,
		options: [
			{ label: "启用", value: "启用" },
			{ label: "禁用", value: "禁用" },
		],
		fieldProps: {
			placeholder: "请选择状态",
			clearable: true,
		},
		width: "150px",
	},

	// 是否外链
	{
		label: "是否外链",
		prop: "是否外链",
		valueType: "select",
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		fieldProps: {
			placeholder: "请选择是否外链",
			clearable: true,
		},
		width: "150px",
		hidden: (formData) => formData.菜单类型 === "按钮" || formData.菜单类型 === "接口",
	},

	// 是否缓存
	{
		label: "是否缓存",
		prop: "是否缓存",
		valueType: "select",
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		fieldProps: {
			placeholder: "请选择是否缓存",
			clearable: true,
		},
		width: "150px",
		hidden: (formData) => formData.菜单类型 === "按钮" || formData.菜单类型 === "接口" || formData.菜单类型 === "目录",
	},

	// 是否隐藏
	{
		label: "是否隐藏",
		prop: "是否隐藏",
		valueType: "select",
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		fieldProps: {
			placeholder: "请选择是否隐藏",
			clearable: true,
		},
		width: "150px",
	},

	// 描述
	{
		label: "描述",
		prop: "描述",
		valueType: "textarea",
		fieldProps: {
			placeholder: "请输入菜单描述信息",
			clearable: true,
			rows: 3,
		},
		width: "100%",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	菜单名称: [
		{ required: true, message: "请输入菜单名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	父级菜单: [{ required: true, message: "请选择父级菜单", trigger: "change" }],
	菜单类型: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
	路由路径: [
		{ required: true, message: "请输入路由路径", trigger: "blur" },
		{ pattern: /^\/[a-zA-Z0-9/-]*$/, message: "路由路径格式不正确，应以/开头", trigger: "blur" },
	],
	组件路径: [
		{ required: true, message: "请输入组件路径", trigger: "blur" },
		{ pattern: /^\/[a-zA-Z0-9/-]*$/, message: "组件路径格式不正确，应以/开头", trigger: "blur" },
	],
	权限标识: [
		{ required: true, message: "请输入权限标识", trigger: "blur" },
		{ pattern: /^[a-zA-Z0-9:_-]+$/, message: "权限标识格式不正确，只能包含字母、数字、冒号、下划线和连字符", trigger: "blur" },
	],
	排序: [
		{ required: true, message: "请输入显示顺序", trigger: "blur" },
		{ type: "number", min: 1, max: 999, message: "显示顺序应在1-999之间", trigger: "blur" },
	],
	状态: [{ required: true, message: "请选择状态", trigger: "change" }],
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