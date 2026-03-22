<!--
  合同草稿表单
  用于新增、修改合同草稿
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { ContractDraftFormVO } from "@01s-11comm/type";
import { contractTypeOptions } from "@01s-11comm/type";

import { ContractDraftFormProps } from "./form";

const { locale } = useI18nConfig();

const props = defineProps<ContractDraftFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ContractDraftFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & ContractDraftFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 合同基本信息
	{
		/** @description 合同名称 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractName")),
		prop: "contractName",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.contractName")),
		},
	},
	{
		/** @description 合同编号 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractNumber")),
		prop: "contractNumber",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.contractNumber")),
		},
	},
	{
		/** @description 合同类型 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractType")),
		prop: "contractType",
		valueType: "select",
		options: contractTypeOptions,
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.contractType")),
		},
	},

	// 甲方信息
	{
		/** @description 甲方 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyA")),
		prop: "partyA",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyA")),
		},
	},
	{
		/** @description 甲方联系人 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyAContact")),
		prop: "partyAContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyAContact")),
		},
	},
	{
		/** @description 甲方联系电话 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyAPhone")),
		prop: "partyAPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyAPhone")),
		},
	},

	// 乙方信息
	{
		/** @description 乙方 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyB")),
		prop: "partyB",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyB")),
		},
	},
	{
		/** @description 乙方联系人 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyBContact")),
		prop: "partyBContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyBContact")),
		},
	},
	{
		/** @description 乙方联系电话 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyBPhone")),
		prop: "partyBPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyBPhone")),
		},
	},

	// 经办信息
	{
		/** @description 经办人 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.handler")),
		prop: "handler",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.handler")),
		},
	},
	{
		/** @description 经办电话 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.handlerPhone")),
		prop: "handlerPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.handlerPhone")),
		},
	},
	{
		/** @description 合同金额 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractAmount")),
		prop: "contractAmount",
		valueType: "input-number",
		required: false,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.contractAmount")),
			precision: 2,
			min: 0,
		},
	},

	// 时间信息
	{
		/** @description 开始时间 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.startTime")),
		},
		required: true,
		span: 8,
	},
	{
		/** @description 结束时间 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.endTime")),
		},
		required: true,
		span: 8,
	},
	{
		/** @description 签订时间 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.signingTime")),
		prop: "signingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.signingTime")),
		},
		required: true,
		span: 8,
	},

	// 说明
	{
		/** @description 说明 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.description")),
		},
		span: 24,
	},

	// 合同附件
	{
		/** @description 合同附件 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.attachments")),
		prop: "attachments",
		valueType: "text",
		fieldProps: {
			action: "/api/upload",
			multiple: true,
			limit: 5,
			fileList: [],
			accept: ".pdf,.doc,.docx,.xls,.xlsx",
			tip: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.attachmentsTip")),
		},
		span: 24,
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	contractName: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractNameLength")),
			trigger: "blur",
		},
	],
	contractNumber: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractNumber")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 30,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractNumberLength")),
			trigger: "blur",
		},
	],
	contractType: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractType")),
			trigger: "change",
		},
	],
	partyA: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyA")),
			trigger: "blur",
		},
	],
	partyAContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyAContact")),
			trigger: "blur",
		},
	],
	partyAPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyAPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	partyB: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyB")),
			trigger: "blur",
		},
	],
	partyBContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyBContact")),
			trigger: "blur",
		},
	],
	partyBPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyBPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	handler: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.handler")),
			trigger: "blur",
		},
	],
	handlerPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.handlerPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.startTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.endTime")),
			trigger: "change",
		},
	],
	signingTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.signingTime")),
			trigger: "change",
		},
	],
}));

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
