<!--
  物业公司表单
  用于新增 修改物业公司信息
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { PropertyManagementCompanyFormProps, type PropertyManagementCompanyFormVO } from "./form";

const props = defineProps<PropertyManagementCompanyFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PropertyManagementCompanyFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & PropertyManagementCompanyFormVO;

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
		label: "物业公司名称",
		prop: "名称",
		valueType: "input",
		width: "240px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入物业公司名称",
		},
	},
	{
		label: "公司地址",
		prop: "地址",
		valueType: "input",
		width: "320px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入公司详细地址",
		},
	},
	{
		label: "联系电话",
		prop: "电话",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入联系电话",
		},
	},
	{
		label: "管理员",
		prop: "管理员",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入管理员姓名",
		},
	},
	{
		label: "公司法人",
		prop: "公司法人",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入公司法人姓名",
		},
	},
	{
		label: "成立日期",
		prop: "成立日期",
		valueType: "date-picker",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择成立日期",
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
	},
	{
		label: "位置地标",
		prop: "地标",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入位置地标",
		},
	},
	{
		label: "开通小区数量",
		prop: "开通小区数量",
		valueType: "input-number",
		width: "160px",
		fieldProps: {
			min: 0,
			max: 9999,
			precision: 0,
			placeholder: "请输入开通小区数量",
		},
	},
	{
		label: "公司类型",
		prop: "公司类型",
		valueType: "select",
		width: "160px",
		options: [
			{ label: "国企", value: "国企" },
			{ label: "民企", value: "民企" },
			{ label: "外企", value: "外企" },
			{ label: "合资", value: "合资" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择公司类型",
		},
	},
	{
		label: "服务等级",
		prop: "服务等级",
		valueType: "select",
		width: "140px",
		options: [
			{ label: "一级", value: "一级" },
			{ label: "二级", value: "二级" },
			{ label: "三级", value: "三级" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择服务等级",
		},
	},
	{
		label: "运营状态",
		prop: "运营状态",
		valueType: "select",
		width: "140px",
		options: [
			{ label: "正常运营", value: "正常运营" },
			{ label: "暂停服务", value: "暂停服务" },
			{ label: "停止运营", value: "停止运营" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择运营状态",
		},
	},
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	名称: [
		{ required: true, message: "请输入物业公司名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	地址: [
		{ required: true, message: "请输入公司地址", trigger: "blur" },
		{ min: 5, max: 200, message: "长度在 5 到 200 个字符", trigger: "blur" },
	],
	电话: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/, message: "请输入正确的电话号码", trigger: "blur" },
	],
	管理员: [
		{ required: true, message: "请输入管理员姓名", trigger: "blur" },
		{ min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
	],
	公司法人: [
		{ required: true, message: "请输入公司法人姓名", trigger: "blur" },
		{ min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
	],
	成立日期: [{ required: true, message: "请选择成立日期", trigger: "change" }],
	地标: [{ max: 50, message: "长度不能超过 50 个字符", trigger: "blur" }],
	开通小区数量: [
		{ required: true, message: "请输入开通小区数量", trigger: "blur" },
		{ type: "number", min: 0, max: 9999, message: "数量范围 0-9999", trigger: "blur" },
	],
	公司类型: [{ required: true, message: "请选择公司类型", trigger: "change" }],
	服务等级: [{ required: true, message: "请选择服务等级", trigger: "change" }],
	运营状态: [{ required: true, message: "请选择运营状态", trigger: "change" }],
	备注: [{ max: 500, message: "备注长度不能超过 500 个字符", trigger: "blur" }],
});

/** 默认对外导出函数 */
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
			:label-width="120"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
