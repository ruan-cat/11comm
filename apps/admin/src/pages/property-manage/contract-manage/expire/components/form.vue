<!--
  合同到期表单
  用于处理合同到期的续签或终止
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { ContractExpireFormProps, 到期处理类型, 合同类型, 合同到期表单_VO, defaultForm } from "./form";

const props = defineProps<ContractExpireFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 合同到期表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 合同到期表单_VO;

/** 表单对象 */
const form = ref(toRefForm);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	// 合同到期信息分组标题
	{
		label: "合同到期处理",
		prop: "合同到期标题",
		span: 24,
	},
	// 合同基本信息
	{
		label: "合同名称",
		prop: "合同名称",
		valueType: "input",
		required: true,
		span: 8,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入合同名称",
		},
	},
	{
		label: "合同编号",
		prop: "合同编号",
		valueType: "input",
		required: true,
		span: 8,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入合同编号",
		},
	},
	{
		label: "合同类型",
		prop: "合同类型",
		valueType: "select",
		options: [
			{ label: "采购合同", value: "采购合同" },
			{ label: "销售合同", value: "销售合同" },
			{ label: "服务合同", value: "服务合同" },
			{ label: "租赁合同", value: "租赁合同" },
			{ label: "劳务合同", value: "劳务合同" },
			{ label: "技术合同", value: "技术合同" },
		],
		required: true,
		span: 8,
		width: "180px",
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择合同类型",
		},
	},

	// 甲方信息
	{
		label: "甲方",
		prop: "甲方",
		valueType: "input",
		required: true,
		span: 8,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入甲方名称",
		},
	},
	{
		label: "甲方联系人",
		prop: "甲方联系人",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入甲方联系人",
		},
	},
	{
		label: "甲方联系电话",
		prop: "甲方联系电话",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入甲方联系电话",
		},
	},

	// 乙方信息
	{
		label: "乙方",
		prop: "乙方",
		valueType: "input",
		required: true,
		span: 8,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入乙方名称",
		},
	},
	{
		label: "乙方联系人",
		prop: "乙方联系人",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入乙方联系人",
		},
	},
	{
		label: "乙方联系电话",
		prop: "乙方联系电话",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入乙方联系电话",
		},
	},

	// 经办信息
	{
		label: "经办人",
		prop: "经办人",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入经办人姓名",
		},
	},
	{
		label: "经办电话",
		prop: "经办电话",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入经办电话",
		},
	},
	{
		label: "合同金额",
		prop: "合同金额",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入合同金额",
		},
	},

	// 时间信息
	{
		label: "开始时间",
		prop: "开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: "请选择开始时间",
		},
		required: true,
		span: 8,
		width: "220px",
	},
	{
		label: "结束时间",
		prop: "结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: "请选择结束时间",
		},
		required: true,
		span: 8,
		width: "220px",
	},
	{
		label: "签订时间",
		prop: "签订时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: "请选择签订时间",
		},
		required: true,
		span: 8,
		width: "220px",
	},

	// 到期处理信息
	{
		label: "到期处理类型",
		prop: "到期处理类型",
		valueType: "select",
		options: [
			{ label: "续签", value: "续签" },
			{ label: "终止", value: "终止" },
		],
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择处理类型",
		},
	},
	{
		label: "处理人",
		prop: "处理人",
		valueType: "input",
		required: true,
		span: 16,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入处理人姓名",
		},
	},

	// 说明
	{
		label: "说明",
		prop: "说明",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: "请输入处理说明",
			clearable: true,
		},
		required: true,
		span: 24,
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	合同名称: [
		{ required: true, message: "请输入合同名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	合同编号: [
		{ required: true, message: "请输入合同编号", trigger: "blur" },
		{ min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" },
	],
	合同类型: [{ required: true, message: "请选择合同类型", trigger: "change" }],
	甲方: [
		{ required: true, message: "请输入甲方名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	甲方联系人: [
		{ required: true, message: "请输入甲方联系人", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	甲方联系电话: [
		{ required: true, message: "请输入甲方联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	乙方: [
		{ required: true, message: "请输入乙方名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	乙方联系人: [
		{ required: true, message: "请输入乙方联系人", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	乙方联系电话: [
		{ required: true, message: "请输入乙方联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	经办人: [
		{ required: true, message: "请输入经办人姓名", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	经办电话: [
		{ required: true, message: "请输入经办电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	合同金额: [
		{ required: true, message: "请输入合同金额", trigger: "blur" },
		{ pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: "请输入正确的金额格式", trigger: "blur" },
	],
	开始时间: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	结束时间: [{ required: true, message: "请选择结束时间", trigger: "change" }],
	签订时间: [{ required: true, message: "请选择签订时间", trigger: "change" }],
	到期处理类型: [{ required: true, message: "请选择到期处理类型", trigger: "change" }],
	处理人: [
		{ required: true, message: "请输入处理人姓名", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	说明: [
		{ required: true, message: "请输入处理说明", trigger: "blur" },
		{ min: 5, max: 500, message: "长度在 5 到 500 个字符", trigger: "blur" },
	],
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
