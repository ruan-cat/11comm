<!--
  合同变更表单
  用于新增 修改合同变更
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { ContractChangeFormProps, ContractChangeFormVO } from "./form";

const props = defineProps<ContractChangeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ContractChangeFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & ContractChangeFormVO;

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
	// 合同变更信息分组标题
	{
		label: "合同变更信息",
		prop: "contractChangeTitle",
		span: 24,
	},
	// 合同基本信息
	{
		label: "合同名称",
		prop: "contractName",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入合同名称",
		},
	},
	{
		label: "合同编号",
		prop: "contractNumber",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入合同编号",
		},
	},
	{
		label: "合同类型",
		prop: "contractType",
		valueType: "select",
		options: [
			{ label: "采购合同", value: "采购合同" },
			{ label: "销售合同", value: "销售合同" },
			{ label: "服务合同", value: "服务合同" },
			{ label: "租赁合同", value: "租赁合同" },
		],
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	// 甲方信息
	{
		label: "甲方",
		prop: "partyA",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入甲方名称",
		},
	},
	{
		label: "甲方联系人",
		prop: "partyAContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入甲方联系人",
		},
	},
	{
		label: "甲方联系电话",
		prop: "partyAPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入甲方联系电话",
		},
	},

	// 乙方信息
	{
		label: "乙方",
		prop: "partyB",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入乙方名称",
		},
	},
	{
		label: "乙方联系人",
		prop: "partyBContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入乙方联系人",
		},
	},
	{
		label: "乙方联系电话",
		prop: "partyBPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入乙方联系电话",
		},
	},

	// 经办信息
	{
		label: "经办人",
		prop: "handler",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入经办人姓名",
		},
	},
	{
		label: "经办电话",
		prop: "handlerPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入经办电话",
		},
	},
	{
		label: "合同金额",
		prop: "contractAmount",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: "请输入合同金额",
		},
	},

	// 时间信息
	{
		label: "开始时间",
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: "请选择开始时间",
		},
		required: true,
		span: 8,
	},
	{
		label: "结束时间",
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: "请选择结束时间",
		},
		required: true,
		span: 8,
	},
	{
		label: "签订时间",
		prop: "signingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: "请选择签订时间",
		},
		required: true,
		span: 8,
	},

	// 变更信息
	{
		label: "变更类型",
		prop: "changeType",
		valueType: "select",
		options: [
			{ label: "合同金额", value: "合同金额" },
			{ label: "服务期限", value: "服务期限" },
			{ label: "服务内容", value: "服务内容" },
			{ label: "付款方式", value: "付款方式" },
			{ label: "合同主体", value: "合同主体" },
		],
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: "变更人",
		prop: "changer",
		valueType: "input",
		required: true,
		span: 16,
		fieldProps: {
			clearable: true,
			placeholder: "请输入变更人姓名",
		},
	},

	// 变更前后内容
	{
		label: "变更前",
		prop: "beforeChange",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: "请输入变更前的内容",
		},
		required: true,
		span: 24,
	},
	{
		label: "变更后",
		prop: "afterChange",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: "请输入变更后的内容",
		},
		required: true,
		span: 24,
	},

	// 说明
	{
		label: "变更说明",
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: "请输入变更说明信息",
		},
		required: true,
		span: 24,
	},

	// 合同附件
	{
		label: "合同附件",
		prop: "attachments",
		valueType: "text",
		fieldProps: {
			action: "/api/upload",
			multiple: true,
			limit: 5,
			accept: ".pdf,.doc,.docx,.xls,.xlsx",
			tip: "支持上传PDF、Word、Excel文件,最多5个文件",
		},
		span: 24,
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	contractName: [
		{ required: true, message: "请输入合同名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	contractNumber: [
		{ required: true, message: "请输入合同编号", trigger: "blur" },
		{ min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" },
	],
	contractType: [{ required: true, message: "请选择合同类型", trigger: "change" }],
	partyA: [{ required: true, message: "请输入甲方名称", trigger: "blur" }],
	partyAContact: [{ required: true, message: "请输入甲方联系人", trigger: "blur" }],
	partyAPhone: [
		{ required: true, message: "请输入甲方联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	partyB: [{ required: true, message: "请输入乙方名称", trigger: "blur" }],
	partyBContact: [{ required: true, message: "请输入乙方联系人", trigger: "blur" }],
	partyBPhone: [
		{ required: true, message: "请输入乙方联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	handler: [{ required: true, message: "请输入经办人姓名", trigger: "blur" }],
	handlerPhone: [
		{ required: true, message: "请输入经办电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	contractAmount: [{ required: true, message: "请输入合同金额", trigger: "blur" }],
	startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
	signingTime: [{ required: true, message: "请选择签订时间", trigger: "change" }],
	changeType: [{ required: true, message: "请选择变更类型", trigger: "change" }],
	changer: [{ required: true, message: "请输入变更人姓名", trigger: "blur" }],
	beforeChange: [{ required: true, message: "请输入变更前的内容", trigger: "blur" }],
	afterChange: [{ required: true, message: "请输入变更后的内容", trigger: "blur" }],
	description: [{ required: true, message: "请输入变更说明", trigger: "blur" }],
});

defineExpose({
	plusFormInstance,
	formComputed,
});
</script>

<template>
	<PlusForm
		ref="plusFormRef"
		v-model="form"
		class="form-root"
		:has-footer="false"
		:default-values="defaultValues"
		:columns="plusFormColumnsComputed"
		:rules="plusFormRules"
		:grid="{ cols: 24 }"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
