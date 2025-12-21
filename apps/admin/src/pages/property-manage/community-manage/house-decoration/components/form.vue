<!--
  房屋装修表单
  用于新增 修改房屋装修信息
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { HouseDecorationFormProps, HouseDecorationFormVO, decorationStatusOptions, delayStatusOptions } from "./form";

const props = defineProps<HouseDecorationFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & HouseDecorationFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & HouseDecorationFormVO;

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
		prop: "houseNumber",
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
		prop: "contactName",
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
		prop: "contactPhone",
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
		prop: "applicationTime",
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
		prop: "decorationTime",
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
		prop: "decorationCompany",
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
		prop: "managerPhone",
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
		prop: "status",
		valueType: "select",
		width: "140px",
		options: decorationStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择装修状态",
		},
		required: true,
	},
	{
		label: "是否延期",
		prop: "isDelayed",
		valueType: "select",
		width: "120px",
		options: delayStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择",
		},
		required: true,
	},
	{
		label: "延期时间",
		prop: "delayTime",
		valueType: "date-picker",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择延期时间",
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
		hidden: (form: HouseDecorationFormVO) => form.isDelayed === "否",
	},
	{
		label: "是否违规",
		prop: "isViolated",
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
		prop: "violationDescription",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入违规说明",
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
		hidden: (form: HouseDecorationFormVO) => form.isViolated === "否",
	},
	{
		label: "备注",
		prop: "remarks",
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
	houseNumber: [
		{ required: true, message: "请输入房屋编号", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	contactName: [
		{ required: true, message: "请输入联系人姓名", trigger: "blur" },
		{ min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
	],
	contactPhone: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	applicationTime: [{ required: true, message: "请选择申请时间", trigger: "change" }],
	decorationTime: [{ required: true, message: "请选择装修时间", trigger: "change" }],
	decorationCompany: [
		{ required: true, message: "请输入装修单位", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	managerPhone: [
		{ required: true, message: "请输入负责人电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	status: [{ required: true, message: "请选择装修状态", trigger: "change" }],
	isDelayed: [{ required: true, message: "请选择是否延期", trigger: "change" }],
	delayTime: [{ required: true, message: "请选择延期时间", trigger: "change" }],
	isViolated: [{ required: true, message: "请选择是否违规", trigger: "change" }],
	violationDescription: [{ max: 500, message: "违规说明长度不能超过 500 个字符", trigger: "blur" }],
	remarks: [{ max: 500, message: "备注长度不能超过 500 个字符", trigger: "blur" }],
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
