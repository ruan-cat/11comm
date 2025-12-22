<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue";
import { type ChangePasswordRecordFormProps, defaultForm, type ChangePasswordRecordFormVO } from "./form";
import { type FieldValues, type PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";
import {
	changePasswordRecordTypeOptions,
	changePasswordRecordStatusOptions,
	changePasswordRecordDepartmentOptions,
} from "@01s-11comm/type";

const props = defineProps<ChangePasswordRecordFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ChangePasswordRecordFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

/** 表单重设 */
usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = structuredClone(props.form) as FieldValues & ChangePasswordRecordFormVO;

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
		label: "记录ID",
		prop: "id",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "用户名",
		prop: "username",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "真实姓名",
		prop: "realName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "所属部门",
		prop: "department",
		valueType: "select",
		options: changePasswordRecordDepartmentOptions,
	},
	{
		label: "修改时间",
		prop: "changeTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
	},
	{
		label: "修改IP",
		prop: "changeIp",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "修改类型",
		prop: "changeType",
		valueType: "select",
		options: changePasswordRecordTypeOptions,
	},
	{
		label: "操作人",
		prop: "operator",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: changePasswordRecordStatusOptions,
	},
	{
		label: "备注",
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			clearable: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	username: [
		{ required: true, message: "请输入用户名", trigger: "blur" },
		{ min: 3, max: 20, message: "用户名长度应在3-20个字符之间", trigger: "blur" },
	],
	realName: [
		{ required: true, message: "请输入真实姓名", trigger: "blur" },
		{ min: 2, max: 10, message: "真实姓名长度应在2-10个字符之间", trigger: "blur" },
	],
	department: [{ required: true, message: "请选择所属部门", trigger: "change" }],
	changeTime: [{ required: true, message: "请选择修改时间", trigger: "change" }],
	changeType: [{ required: true, message: "请选择修改类型", trigger: "change" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

/** 计算属性：表单列配置 */
const plusFormColumnsComputed = computed(() => {
	return plusFormColumns.value;
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
