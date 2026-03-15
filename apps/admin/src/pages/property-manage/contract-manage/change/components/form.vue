<!--
  合同变更表单
  用于新增 修改合同变更
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { ContractChangeFormVO } from "@01s-11comm/type";
import type { ContractChangeFormProps } from "./form";

const props = defineProps<ContractChangeFormProps>();

const { computed } = useI18nConfig();

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

const translatedContractTypeOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.contractTypes.purchase")),
		value: "采购合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.contractTypes.sales")),
		value: "销售合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.contractTypes.service")),
		value: "服务合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.contractTypes.lease")),
		value: "租赁合同",
	},
]);

const translatedChangeTypeOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.amount")),
		value: "合同金额",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.period")),
		value: "服务期限",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.content")),
		value: "服务内容",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.payment")),
		value: "付款方式",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.subject")),
		value: "合同主体",
	},
]);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 合同变更信息分组标题
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractChangeTitle")),
		prop: "contractChangeTitle",
		span: 24,
	},
	// 合同基本信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractName")),
		prop: "contractName",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.contractName")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractNumber")),
		prop: "contractNumber",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.contract-change.form.placeholders.contractNumber"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractType")),
		prop: "contractType",
		valueType: "select",
		options: translatedContractTypeOptions.value,
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	// 甲方信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyA")),
		prop: "partyA",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyA")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyAContact")),
		prop: "partyAContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyAContact")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyAPhone")),
		prop: "partyAPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyAPhone")),
		},
	},

	// 乙方信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyB")),
		prop: "partyB",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyB")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyBContact")),
		prop: "partyBContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyBContact")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyBPhone")),
		prop: "partyBPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyBPhone")),
		},
	},

	// 经办信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.handler")),
		prop: "handler",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.handler")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.handlerPhone")),
		prop: "handlerPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.handlerPhone")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractAmount")),
		prop: "contractAmount",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.contract-change.form.placeholders.contractAmount"),
			),
		},
	},
	// 时间信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.startTime")),
		},
		required: true,
		span: 8,
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.endTime")),
		},
		required: true,
		span: 8,
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.signingTime")),
		prop: "signingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.signingTime")),
		},
		required: true,
		span: 8,
	},

	// 变更信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.changeType")),
		prop: "changeType",
		valueType: "select",
		options: translatedChangeTypeOptions.value,
		required: true,
		span: 8,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.changer")),
		prop: "changer",
		valueType: "input",
		required: true,
		span: 16,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.changer")),
		},
	},
	// 变更前后内容
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.beforeChange")),
		prop: "beforeChange",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.beforeChange")),
		},
		required: true,
		span: 24,
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.afterChange")),
		prop: "afterChange",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.afterChange")),
		},
		required: true,
		span: 24,
	},

	// 说明
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.description")),
		},
		required: true,
		span: 24,
	},

	// 合同附件
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.attachments")),
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

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	contractName: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractNameLength")),
			trigger: "blur",
		},
	],
	contractNumber: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractNumber")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 30,
			message: transformI18n(
				$t("property-manage_contract-manage.contract-change.form.validation.contractNumberLength"),
			),
			trigger: "blur",
		},
	],
	contractType: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractType")),
			trigger: "change",
		},
	],
	partyA: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyA")),
			trigger: "blur",
		},
	],
	partyAContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyAContact")),
			trigger: "blur",
		},
	],
	partyAPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyAPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	partyB: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyB")),
			trigger: "blur",
		},
	],
	partyBContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyBContact")),
			trigger: "blur",
		},
	],
	partyBPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyBPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	handler: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.handler")),
			trigger: "blur",
		},
	],
	handlerPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.handlerPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	contractAmount: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractAmount")),
			trigger: "blur",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.startTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.endTime")),
			trigger: "change",
		},
	],
	signingTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.signingTime")),
			trigger: "change",
		},
	],
	changeType: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.changeType")),
			trigger: "change",
		},
	],
	changer: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.changer")),
			trigger: "blur",
		},
	],
	beforeChange: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.beforeChange")),
			trigger: "blur",
		},
	],
	afterChange: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.afterChange")),
			trigger: "blur",
		},
	],
	description: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.description")),
			trigger: "blur",
		},
	],
}));

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
		:columns="plusFormColumns"
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
