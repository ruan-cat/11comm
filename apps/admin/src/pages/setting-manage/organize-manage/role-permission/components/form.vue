<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useTemplateRef } from "vue";
import { cloneDeep } from "lodash-es";
import type { PlusColumn } from "plus-pro-components";

import { RolePermissionFormProps, type 角色权限表单_VO } from "./form";

/** 表单组件 props */
const props = defineProps<RolePermissionFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 角色权限表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 角色权限表单_VO;

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
		label: "角色名称",
		prop: "角色名称",
		valueType: "input",
		fieldProps: {
			readonly: false,
		},
	},
	{
		label: "角色编码",
		prop: "角色编码",
		valueType: "input",
		fieldProps: {
			readonly: false,
		},
	},
	{
		label: "角色状态",
		prop: "状态",
		valueType: "select",
		options: [
			{ label: "启用", value: "启用" },
			{ label: "禁用", value: "禁用" },
		],
		fieldProps: {
			readonly: false,
		},
	},
	{
		label: "角色描述",
		prop: "描述",
		valueType: "textarea",
		fieldProps: {
			readonly: false,
			rows: 4,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	角色名称: [
		{ required: true, message: "请输入角色名称", trigger: "blur" },
		{ min: 2, max: 50, message: "角色名称长度在 2 到 50 个字符", trigger: "blur" },
	],
	角色编码: [
		{ required: true, message: "请输入角色编码", trigger: "blur" },
		{
			pattern: /^[A-Z][A-Z0-9_]*$/,
			message: "角色编码只能包含大写字母、数字和下划线，且以大写字母开头",
			trigger: "blur",
		},
	],
	状态: [{ required: true, message: "请选择角色状态", trigger: "change" }],
	描述: [{ max: 200, message: "角色描述不能超过 200 个字符", trigger: "blur" }],
});

// 默认导出表单实例和表单对象，供外部使用
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
