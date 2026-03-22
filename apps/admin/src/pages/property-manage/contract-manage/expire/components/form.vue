<!--
  合同到期表单
  用于处理合同到期的续签或终止
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { ContractExpireFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { ContractExpireFormProps, defaultForm } from "./form";

const props = defineProps<ContractExpireFormProps>();

const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ContractExpireFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & ContractExpireFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedContractTypeOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.options.contractTypes.purchase")),
		value: "采购合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.options.contractTypes.sales")),
		value: "销售合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.options.contractTypes.service")),
		value: "服务合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.options.contractTypes.lease")),
		value: "租赁合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.options.contractTypes.labor")),
		value: "劳务合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.options.contractTypes.technology")),
		value: "技术合同",
	},
]);

const translatedProcessingTypeOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.options.processingTypes.renewal")),
		value: "续签",
	},
	{
		label: transformI18n(
			$t("property-manage_contract-manage.expired-contract.form.options.processingTypes.termination"),
		),
		value: "终止",
	},
]);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 合同到期信息分组标题
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.contractExpireTitle")),
		prop: "contractExpireTitle",
		span: 24,
	},
	// 合同基本信息
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.contractName")),
		prop: "contractName",
		valueType: "input",
		required: true,
		span: 8,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.contractName")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.contractNumber")),
		prop: "contractNumber",
		valueType: "input",
		required: true,
		span: 8,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.expired-contract.form.placeholders.contractNumber"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.contractType")),
		prop: "contractType",
		valueType: "select",
		options: translatedContractTypeOptions.value,
		required: true,
		span: 8,
		width: "180px",
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.contractType")),
		},
	},

	// 甲方信息
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.partyA")),
		prop: "partyA",
		valueType: "input",
		required: true,
		span: 8,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.partyA")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.partyAContact")),
		prop: "partyAContact",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.expired-contract.form.placeholders.partyAContact"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.partyAPhone")),
		prop: "partyAPhone",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.partyAPhone")),
		},
	},

	// 乙方信息
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.partyB")),
		prop: "partyB",
		valueType: "input",
		required: true,
		span: 8,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.partyB")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.partyBContact")),
		prop: "partyBContact",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.expired-contract.form.placeholders.partyBContact"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.partyBPhone")),
		prop: "partyBPhone",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.partyBPhone")),
		},
	},

	// 经办信息
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.handler")),
		prop: "handler",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.handler")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.handlerPhone")),
		prop: "handlerPhone",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.handlerPhone")),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.contractAmount")),
		prop: "contractAmount",
		valueType: "input",
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.expired-contract.form.placeholders.contractAmount"),
			),
		},
	},

	// 时间信息
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.startTime")),
		},
		required: true,
		span: 8,
		width: "220px",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.endTime")),
		},
		required: true,
		span: 8,
		width: "220px",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.signingTime")),
		prop: "signingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.signingTime")),
		},
		required: true,
		span: 8,
		width: "220px",
	},

	// 到期处理信息
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.processingType")),
		prop: "processingType",
		valueType: "select",
		options: translatedProcessingTypeOptions.value,
		required: true,
		span: 8,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.expired-contract.form.placeholders.processingType"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.processor")),
		prop: "processor",
		valueType: "input",
		required: true,
		span: 16,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.processor")),
		},
	},

	// 说明
	{
		label: transformI18n($t("property-manage_contract-manage.expired-contract.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: transformI18n($t("property-manage_contract-manage.expired-contract.form.placeholders.description")),
			clearable: true,
		},
		required: true,
		span: 24,
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	contractName: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.contractName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.contractNameLength")),
			trigger: "blur",
		},
	],
	contractNumber: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.contractNumber")),
			trigger: "blur",
		},
		{
			min: 3,
			max: 30,
			message: transformI18n(
				$t("property-manage_contract-manage.expired-contract.form.validation.contractNumberLength"),
			),
			trigger: "blur",
		},
	],
	contractType: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.contractType")),
			trigger: "change",
		},
	],
	partyA: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.partyA")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.partyALength")),
			trigger: "blur",
		},
	],
	partyAContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.partyAContact")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 20,
			message: transformI18n(
				$t("property-manage_contract-manage.expired-contract.form.validation.partyAContactLength"),
			),
			trigger: "blur",
		},
	],
	partyAPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.partyAPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	partyB: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.partyB")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.partyBLength")),
			trigger: "blur",
		},
	],
	partyBContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.partyBContact")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 20,
			message: transformI18n(
				$t("property-manage_contract-manage.expired-contract.form.validation.partyBContactLength"),
			),
			trigger: "blur",
		},
	],
	partyBPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.partyBPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	handler: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.handler")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 20,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.handlerLength")),
			trigger: "blur",
		},
	],
	handlerPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.handlerPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	contractAmount: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.contractAmount")),
			trigger: "blur",
		},
		{
			pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.amountFormat")),
			trigger: "blur",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.startTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.endTime")),
			trigger: "change",
		},
	],
	signingTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.signingTime")),
			trigger: "change",
		},
	],
	processingType: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.processingType")),
			trigger: "change",
		},
	],
	processor: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.processor")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 20,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.processorLength")),
			trigger: "blur",
		},
	],
	description: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.description")),
			trigger: "blur",
		},
		{
			min: 5,
			max: 500,
			message: transformI18n($t("property-manage_contract-manage.expired-contract.form.validation.descriptionLength")),
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
	<section :key="locale" class="form-root">
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
