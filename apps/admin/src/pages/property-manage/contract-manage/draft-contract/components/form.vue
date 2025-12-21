<!--
  合同草稿表单
  用于新增、修改合同草稿
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { ContractDraftFormProps, ContractDraftFormVO } from "./form";
import { contractTypeOptions } from "@01s-11comm/type";

const props = defineProps<ContractDraftFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ContractDraftFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & ContractDraftFormVO;

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
	// 合同基本信息
	{
		/** @description 合同名称 */
		label: "合同名称",
		prop: "contractName",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写合同名称",
		},
	},
	{
		/** @description 合同编号 */
		label: "合同编号",
		prop: "contractNumber",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写合同编号",
		},
	},
	{
		/** @description 合同类型 */
		label: "合同类型",
		prop: "contractType",
		valueType: "select",
		options: contractTypeOptions,
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请选择合同类型",
		},
	},

	// 甲方信息
	{
		/** @description 甲方 */
		label: "甲方",
		prop: "partyA",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写甲方",
		},
	},
	{
		/** @description 甲方联系人 */
		label: "甲方联系人",
		prop: "partyAContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写甲方联系人",
		},
	},
	{
		/** @description 甲方联系电话 */
		label: "甲方联系电话",
		prop: "partyAPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写甲方联系电话",
		},
	},

	// 乙方信息
	{
		/** @description 乙方 */
		label: "乙方",
		prop: "partyB",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写乙方",
		},
	},
	{
		/** @description 乙方联系人 */
		label: "乙方联系人",
		prop: "partyBContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写乙方联系人",
		},
	},
	{
		/** @description 乙方联系电话 */
		label: "乙方联系电话",
		prop: "partyBPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写乙方联系电话",
		},
	},

	// 经办信息
	{
		/** @description 经办人 */
		label: "经办人",
		prop: "handler",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写经办人",
		},
	},
	{
		/** @description 经办电话 */
		label: "经办电话",
		prop: "handlerPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写经办电话",
		},
	},
	{
		/** @description 合同金额 */
		label: "合同金额",
		prop: "contractAmount",
		valueType: "input-number",
		required: false,
		span: 8,
		fieldProps: {
			placeholder: "选填，请填写合同金额",
			precision: 2,
			min: 0,
		},
	},

	// 时间信息
	{
		/** @description 开始时间 */
		label: "开始时间",
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: "必填，请选择开始时间",
		},
		required: true,
		span: 8,
	},
	{
		/** @description 结束时间 */
		label: "结束时间",
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: "必填，请选择结束时间",
		},
		required: true,
		span: 8,
	},
	{
		/** @description 签订时间 */
		label: "签订时间",
		prop: "signingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: "必填，请选择签订时间",
		},
		required: true,
		span: 8,
	},

	// 说明
	{
		/** @description 说明 */
		label: "说明",
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: "选填，请输入合同说明信息",
		},
		span: 24,
	},

	// 合同附件
	{
		/** @description 合同附件 */
		label: "合同附件",
		prop: "attachments",
		valueType: "text",
		fieldProps: {
			action: "/api/upload",
			multiple: true,
			limit: 5,
			fileList: [],
			accept: ".pdf,.doc,.docx,.xls,.xlsx",
			tip: "支持上传PDF、Word、Excel文件，最多5个文件",
		},
		span: 24,
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	contractName: [
		{ required: true, message: "请填写合同名称", trigger: "blur" },
		{ min: 2, max: 50, message: "合同名称长度在 2 到 50 个字符", trigger: "blur" },
	],
	contractNumber: [
		{ required: true, message: "请填写合同编号", trigger: "blur" },
		{ min: 2, max: 30, message: "合同编号长度在 2 到 30 个字符", trigger: "blur" },
	],
	contractType: [{ required: true, message: "请选择合同类型", trigger: "change" }],
	partyA: [{ required: true, message: "请填写甲方", trigger: "blur" }],
	partyAContact: [{ required: true, message: "请填写甲方联系人", trigger: "blur" }],
	partyAPhone: [
		{ required: true, message: "请填写甲方联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	partyB: [{ required: true, message: "请填写乙方", trigger: "blur" }],
	partyBContact: [{ required: true, message: "请填写乙方联系人", trigger: "blur" }],
	partyBPhone: [
		{ required: true, message: "请填写乙方联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	handler: [{ required: true, message: "请填写经办人", trigger: "blur" }],
	handlerPhone: [
		{ required: true, message: "请填写经办电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
	signingTime: [{ required: true, message: "请选择签订时间", trigger: "change" }],
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
			:grid="{ cols: 24 }"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
