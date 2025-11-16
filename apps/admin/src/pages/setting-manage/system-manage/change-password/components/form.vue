<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue";
import { type ChangePasswordRecordFormProps, defaultForm, type 密码修改记录表单_VO } from "./form";
import { type OptionsType } from "plus-pro-components";

const props = defineProps<ChangePasswordRecordFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 密码修改记录表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 密码修改记录表单_VO;

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

/** 修改类型选项 */
const 修改类型Options: OptionsType = [
	{
		label: "用户自行修改",
		value: "用户自行修改",
	},
	{
		label: "管理员重置",
		value: "管理员重置",
	},
	{
		label: "强制修改",
		value: "强制修改",
	},
	{
		label: "首次登录修改",
		value: "首次登录修改",
	},
];

/** 修改状态选项 */
const 状态选项: OptionsType = [
	{
		label: "成功",
		value: "成功",
	},
	{
		label: "失败",
		value: "失败",
	},
	{
		label: "待审核",
		value: "待审核",
	},
];

/** 部门选项 */
const 部门选项: OptionsType = [
	{
		label: "物业团队",
		value: "物业团队",
	},
	{
		label: "开发团队",
		value: "开发团队",
	},
	{
		label: "运营团队",
		value: "运营团队",
	},
	{
		label: "财务部门",
		value: "财务部门",
	},
	{
		label: "客服部门",
		value: "客服部门",
	},
	{
		label: "维修部门",
		value: "维修部门",
	},
	{
		label: "安保部门",
		value: "安保部门",
	},
	{
		label: "绿化部门",
		value: "绿化部门",
	},
];

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "记录ID",
		prop: "记录ID",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: "用户名",
		prop: "用户名",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "真实姓名",
		prop: "真实姓名",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "所属部门",
		prop: "所属部门",
		valueType: "select",
		options: 部门选项,
	},
	{
		label: "修改时间",
		prop: "修改时间",
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
		prop: "修改IP",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "修改类型",
		prop: "修改类型",
		valueType: "select",
		options: 修改类型Options,
	},
	{
		label: "操作人",
		prop: "操作人",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态选项,
	},
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			clearable: true,
		},
	},
]);

/** 表单验证规则 */
const plusFormRules = reactive({
	用户名: [
		{ required: true, message: "请输入用户名", trigger: "blur" } as FormItemRule,
		{ min: 3, max: 20, message: "用户名长度应在3-20个字符之间", trigger: "blur" } as FormItemRule,
	],
	真实姓名: [
		{ required: true, message: "请输入真实姓名", trigger: "blur" } as FormItemRule,
		{ min: 2, max: 10, message: "真实姓名长度应在2-10个字符之间", trigger: "blur" } as FormItemRule,
	],
	所属部门: [
		{ required: true, message: "请选择所属部门", trigger: "change" } as FormItemRule,
	],
	修改时间: [
		{ required: true, message: "请选择修改时间", trigger: "change" } as FormItemRule,
	],
	修改类型: [
		{ required: true, message: "请选择修改类型", trigger: "change" } as FormItemRule,
	],
	状态: [
		{ required: true, message: "请选择状态", trigger: "change" } as FormItemRule,
	],
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