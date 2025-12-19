<!--
  商户管理员表单
  用于新增 修改商户管理员信息
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { MerchantAdminFormProps, type FormVO, propertyCompanyOptions } from "./form";
import { statusOptions } from "@01s-11comm/type";

const props = defineProps<MerchantAdminFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & FormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & FormVO;

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
		label: "物业公司",
		prop: "物业公司",
		valueType: "select",
		options: propertyCompanyOptions,
		width: "300px",
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择物业公司",
		},
	},
	{
		label: "管理员姓名",
		prop: "管理员姓名",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入管理员姓名",
		},
	},
	{
		label: "管理员电话",
		prop: "管理员电话",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入管理员电话",
		},
	},
	{
		label: "管理员邮箱",
		prop: "管理员邮箱",
		valueType: "input",
		width: "250px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入管理员邮箱",
		},
	},
	{
		label: "身份证号码",
		prop: "身份证号码",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入身份证号码",
		},
	},
	{
		label: "账户状态",
		prop: "账户状态",
		valueType: "select",
		options: statusOptions,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择账户状态",
		},
	},
	{
		label: "登录密码",
		prop: "登录密码",
		valueType: "input",
		width: "200px",
		fieldProps: {
			type: "password",
			clearable: true,
			placeholder: "请输入登录密码",
			showPassword: true,
		},
	},
	{
		label: "确认密码",
		prop: "确认密码",
		valueType: "input",
		width: "200px",
		fieldProps: {
			type: "password",
			clearable: true,
			placeholder: "请确认密码",
			showPassword: true,
		},
	},
	{
		label: "联系地址",
		prop: "联系地址",
		valueType: "input",
		width: "400px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入联系地址",
		},
	},
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
		width: "400px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	物业公司: [{ required: true, message: "请选择物业公司", trigger: "change" }],
	管理员姓名: [
		{ required: true, message: "请输入管理员姓名", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	管理员电话: [
		{ required: true, message: "请输入管理员电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	管理员邮箱: [{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
	身份证号码: [
		{ required: true, message: "请输入身份证号码", trigger: "blur" },
		{ pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: "请输入正确的身份证号码", trigger: "blur" },
	],
	账户状态: [{ required: true, message: "请选择账户状态", trigger: "change" }],
	登录密码: [
		{ required: true, message: "请输入登录密码", trigger: "blur" },
		{ min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
	],
	确认密码: [
		{ required: true, message: "请确认密码", trigger: "blur" },
		{
			validator: (rule: any, value: string, callback: any) => {
				if (value !== form.value.登录密码) {
					callback(new Error("两次输入密码不一致"));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
});

/** 默认对外导出 */
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
