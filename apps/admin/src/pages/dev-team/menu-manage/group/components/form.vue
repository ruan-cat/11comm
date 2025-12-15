<!--
  菜单组表单
  用于新增/修改菜单组
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import {
	MenuGroupFormProps,
	MenuGroupFormVO,
	defaultForm,
	groupTypeOptions,
	menuGroupStatusOptions,
	storeOptions,
	iconOptions,
} from "./form";

const props = defineProps<MenuGroupFormProps>();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & MenuGroupFormVO;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = cloneDeep(props.form) as FieldValues & MenuGroupFormVO;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 Form columns configuration */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "组编号",
		prop: "groupId",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入组编号，如：GROUP001",
		},
	},
	{
		label: "组名称",
		prop: "groupName",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入组名称",
		},
	},
	{
		label: "组编码",
		prop: "groupCode",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入组编码，如：SYSTEM_MANAGE",
		},
	},
	{
		label: "组类型",
		prop: "groupType",
		valueType: "select",
		width: "180px",
		required: true,
		options: groupTypeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择组类型",
		},
	},
	{
		label: "归属商户",
		prop: "storeName",
		valueType: "select",
		width: "180px",
		required: true,
		options: storeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择归属商户",
		},
	},
	{
		label: "显示顺序",
		prop: "sortNo",
		valueType: "input-number",
		width: "150px",
		required: true,
		fieldProps: {
			min: 1,
			max: 9999,
			placeholder: "请输入显示顺序",
		},
	},
	{
		label: "图标",
		prop: "icon",
		valueType: "select",
		width: "200px",
		required: true,
		options: iconOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择图标",
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		width: "150px",
		required: true,
		options: menuGroupStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},
	{
		label: "描述",
		prop: "description",
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

/** 表单项配置 动态计算 只读 Computed form columns */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 Form validation rules */
const plusFormRules = ref<PlusFormRules>({
	groupId: [
		{ required: true, message: "请输入组编号", trigger: "blur" },
		{ min: 3, max: 20, message: "组编号长度在 3 到 20 个字符", trigger: "blur" },
		{ pattern: /^[A-Z0-9_]+$/, message: "组编号只能包含大写字母、数字和下划线", trigger: "blur" },
	],
	groupName: [
		{ required: true, message: "请输入组名称", trigger: "blur" },
		{ min: 2, max: 50, message: "组名称长度在 2 到 50 个字符", trigger: "blur" },
	],
	groupCode: [
		{ required: true, message: "请输入组编码", trigger: "blur" },
		{ min: 3, max: 50, message: "组编码长度在 3 到 50 个字符", trigger: "blur" },
		{ pattern: /^[A-Z_]+$/, message: "组编码只能包含大写字母和下划线", trigger: "blur" },
	],
	groupType: [{ required: true, message: "请选择组类型", trigger: "change" }],
	storeName: [{ required: true, message: "请选择归属商户", trigger: "change" }],
	sortNo: [
		{ required: true, message: "请输入显示顺序", trigger: "blur" },
		{ type: "number", min: 1, max: 9999, message: "显示顺序必须在 1-9999 之间", trigger: "blur" },
	],
	icon: [{ required: true, message: "请选择图标", trigger: "change" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
	description: [{ max: 200, message: "描述长度不能超过 200 个字符", trigger: "blur" }],
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
