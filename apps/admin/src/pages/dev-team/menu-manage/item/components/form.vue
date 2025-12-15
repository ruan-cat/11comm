<!--
  菜单项表单
  用于新增、修改菜单项
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import {
	MenuItemFormProps,
	MenuItemFormVO,
	defaultForm,
	menuTypeOptions,
	menuItemStatusOptions,
	booleanOptions,
} from "./form";

const props = defineProps<MenuItemFormProps>();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & MenuItemFormVO;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = cloneDeep(props.form) as FieldValues & MenuItemFormVO;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

/** 父级菜单选项 Parent menu options */
const parentMenuOptions = [
	{ label: "根菜单", value: "根菜单" },
	{ label: "系统管理", value: "系统管理" },
	{ label: "监控管理", value: "监控管理" },
	{ label: "系统工具", value: "系统工具" },
	{ label: "日志管理", value: "日志管理" },
	{ label: "系统设置", value: "系统设置" },
];

/** 表单项配置 Form columns configuration */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "菜单名称",
		prop: "menuName",
		valueType: "input",
		required: true,
		fieldProps: {
			placeholder: "请输入菜单名称",
			clearable: true,
		},
		width: "200px",
	},
	{
		label: "父级菜单",
		prop: "parentMenu",
		valueType: "select",
		required: true,
		options: parentMenuOptions,
		fieldProps: {
			placeholder: "请选择父级菜单",
			clearable: true,
		},
		width: "200px",
	},
	{
		label: "菜单类型",
		prop: "menuType",
		valueType: "select",
		required: true,
		options: menuTypeOptions,
		fieldProps: {
			placeholder: "请选择菜单类型",
			clearable: true,
		},
		width: "150px",
	},
	{
		label: "菜单图标",
		prop: "icon",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入图标类名，如：mdi:home",
			clearable: true,
		},
		width: "200px",
	},
	{
		label: "路由路径",
		prop: "routePath",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入路由路径，如：/system/user",
			clearable: true,
		},
		width: "250px",
		hidden: (formData) => formData.menuType === "按钮" || formData.menuType === "接口",
	},
	{
		label: "组件路径",
		prop: "componentPath",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入组件路径，如：/pages/system/user/index",
			clearable: true,
		},
		width: "250px",
		hidden: (formData) => formData.menuType === "按钮" || formData.menuType === "接口" || formData.menuType === "目录",
	},
	{
		label: "权限标识",
		prop: "permissionKey",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入权限标识，如：system:user:list",
			clearable: true,
		},
		width: "250px",
	},
	{
		label: "显示顺序",
		prop: "sortNo",
		valueType: "input-number",
		fieldProps: {
			placeholder: "请输入显示顺序",
			min: 1,
			max: 999,
		},
		width: "150px",
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		required: true,
		options: menuItemStatusOptions,
		fieldProps: {
			placeholder: "请选择状态",
			clearable: true,
		},
		width: "150px",
	},
	{
		label: "是否外链",
		prop: "isExternal",
		valueType: "select",
		options: booleanOptions,
		fieldProps: {
			placeholder: "请选择是否外链",
			clearable: true,
		},
		width: "150px",
		hidden: (formData) => formData.menuType === "按钮" || formData.menuType === "接口",
	},
	{
		label: "是否缓存",
		prop: "isCached",
		valueType: "select",
		options: booleanOptions,
		fieldProps: {
			placeholder: "请选择是否缓存",
			clearable: true,
		},
		width: "150px",
		hidden: (formData) => formData.menuType === "按钮" || formData.menuType === "接口" || formData.menuType === "目录",
	},
	{
		label: "是否隐藏",
		prop: "isHidden",
		valueType: "select",
		options: booleanOptions,
		fieldProps: {
			placeholder: "请选择是否隐藏",
			clearable: true,
		},
		width: "150px",
	},
	{
		label: "描述",
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			placeholder: "请输入菜单描述信息",
			clearable: true,
			rows: 3,
		},
		width: "100%",
	},
]);

/** 表单项配置 动态计算 只读 Computed form columns */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 Form validation rules */
const plusFormRules = ref<PlusFormRules>({
	menuName: [
		{ required: true, message: "请输入菜单名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	parentMenu: [{ required: true, message: "请选择父级菜单", trigger: "change" }],
	menuType: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
	routePath: [
		{ required: true, message: "请输入路由路径", trigger: "blur" },
		{ pattern: /^\/[a-zA-Z0-9/-]*$/, message: "路由路径格式不正确，应以/开头", trigger: "blur" },
	],
	componentPath: [
		{ required: true, message: "请输入组件路径", trigger: "blur" },
		{ pattern: /^\/[a-zA-Z0-9/-]*$/, message: "组件路径格式不正确，应以/开头", trigger: "blur" },
	],
	permissionKey: [
		{ required: true, message: "请输入权限标识", trigger: "blur" },
		{ pattern: /^[a-zA-Z0-9:_-]+$/, message: "权限标识格式不正确，只能包含字母、数字、冒号、下划线和连字符", trigger: "blur" },
	],
	sortNo: [
		{ required: true, message: "请输入显示顺序", trigger: "blur" },
		{ type: "number", min: 1, max: 999, message: "显示顺序应在1-999之间", trigger: "blur" },
	],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
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
