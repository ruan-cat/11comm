<!--
  房屋装修表单
  用于新增 修改房屋装修信息
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { HouseDecorationFormProps, 房屋装修表单_VO, defaultForm, 房屋装修状态类型, 是否延期类型, 是否违规类型 } from "./form";

const props = defineProps<HouseDecorationFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 房屋装修表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 房屋装修表单_VO;

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
		label: "房屋编号",
		prop: "房屋",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入房屋编号，如：A栋101",
		},
		required: true,
	},
	{
		label: "联系人",
		prop: "联系人",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入联系人姓名",
		},
		required: true,
	},
	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入联系电话",
		},
		required: true,
	},
	{
		label: "申请时间",
		prop: "申请时间",
		valueType: "date-picker",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择申请时间",
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	{
		label: "装修时间",
		prop: "装修时间",
		valueType: "date-picker",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择装修开始时间",
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	{
		label: "装修单位",
		prop: "装修单位",
		valueType: "input",
		width: "280px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入装修公司名称",
		},
		required: true,
	},
	{
		label: "负责人电话",
		prop: "负责人电话",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入装修负责人电话",
		},
		required: true,
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		width: "140px",
		options: [
			{ label: "待审核", value: "待审核" },
			{ label: "审核不通过", value: "审核不通过" },
			{ label: "装修中", value: "装修中" },
			{ label: "待验收", value: "待验收" },
			{ label: "验收成功", value: "验收成功" },
			{ label: "验收失败", value: "验收失败" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择装修状态",
		},
		required: true,
	},
	{
		label: "是否延期",
		prop: "是否延期",
		valueType: "select",
		width: "120px",
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择",
		},
		required: true,
	},
	{
		label: "延期时间",
		prop: "延期时间",
		valueType: "date-picker",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择延期时间",
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
		hidden: (form) => form.是否延期 === "否",
	},
	{
		label: "是否违规",
		prop: "是否违规",
		valueType: "select",
		width: "120px",
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择",
		},
		required: true,
	},
	{
		label: "违规说明",
		prop: "违规说明",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入违规说明",
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
		hidden: (form) => form.是否违规 === "否",
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
	房屋: [
		{ required: true, message: "请输入房屋编号", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	联系人: [
		{ required: true, message: "请输入联系人姓名", trigger: "blur" },
		{ min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
	],
	联系电话: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	申请时间: [
		{ required: true, message: "请选择申请时间", trigger: "change" },
	],
	装修时间: [
		{ required: true, message: "请选择装修时间", trigger: "change" },
	],
	装修单位: [
		{ required: true, message: "请输入装修单位", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	负责人电话: [
		{ required: true, message: "请输入负责人电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	状态: [
		{ required: true, message: "请选择装修状态", trigger: "change" },
	],
	是否延期: [
		{ required: true, message: "请选择是否延期", trigger: "change" },
	],
	延期时间: [
		{ required: true, message: "请选择延期时间", trigger: "change" },
	],
	是否违规: [
		{ required: true, message: "请选择是否违规", trigger: "change" },
	],
	违规说明: [
		{ max: 500, message: "违规说明长度不能超过 500 个字符", trigger: "blur" },
	],
	备注: [
		{ max: 500, message: "备注长度不能超过 500 个字符", trigger: "blur" },
	],
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