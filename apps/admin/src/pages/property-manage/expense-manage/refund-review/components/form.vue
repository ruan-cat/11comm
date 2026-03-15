<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { type RefundReviewFormProps, defaultForm } from "./form";
import type { RefundReviewFormVO } from "@01s-11comm/type";
import { refundReasonOptions, auditStatusOptions } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

/** 表单组件的 props */
const props = defineProps<RefundReviewFormProps>();

const { locale, computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & RefundReviewFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & RefundReviewFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.refundOrderNumber")),
		prop: "refundOrderNumber",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.paymentOrderNumber")),
		prop: "paymentOrderNumber",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.feeType")),
		prop: "feeType",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.payer")),
		prop: "payer",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.paymentCycle")),
		prop: "paymentCycle",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.amount")),
		prop: "amount",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.applyTime")),
		prop: "applyTime",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.refundReason")),
		prop: "refundReason",
		valueType: "select",
		options: refundReasonOptions,
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.applicant")),
		prop: "applicant",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.auditStatus")),
		prop: "auditStatus",
		valueType: "select",
		options: auditStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.auditor")),
		prop: "auditor",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.refund-review.form.fields.auditRemark")),
		prop: "auditRemark",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	auditStatus: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.refund-review.form.validation.auditStatusRequired")),
			trigger: "change",
		},
	],
	auditRemark: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.refund-review.form.validation.auditRemarkRequired")),
			trigger: "blur",
		},
	],
}));

// 对外导出
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
