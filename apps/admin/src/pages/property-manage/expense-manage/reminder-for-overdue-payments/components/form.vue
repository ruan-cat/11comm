<!--
  欠费催缴表单
  用于新增 修改欠费催缴记录
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { ReminderForOverduePaymentsFormVO } from "@01s-11comm/type";
import { reminderMethodOptions, reminderStatusOptions } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

interface ReminderForOverduePaymentsFormProps {
	/** 表单数据 */
	form: ReminderForOverduePaymentsFormVO;
	/** 默认值 */
	defaultValues: ReminderForOverduePaymentsFormVO;
}

const props = defineProps<ReminderForOverduePaymentsFormProps>();

const { locale, withLocale } = useI18nConfig();

/** 默认表单数据 */
const defaultForm: ReminderForOverduePaymentsFormVO = {
	ownerName: "",
	paymentObject: "",
	feeName: "",
	reminderAmount: "",
	reminderMethod: "",
	reminderStatus: "",
	reminderTime: "",
	reminderRemark: "",
};

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ReminderForOverduePaymentsFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & ReminderForOverduePaymentsFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.reminder-for-overdue-payments.form.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.placeholders.ownerName"),
			),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reminder-for-overdue-payments.form.fields.paymentObject")),
		prop: "paymentObject",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.placeholders.paymentObject"),
			),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reminder-for-overdue-payments.form.fields.feeName")),
		prop: "feeName",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.placeholders.feeName"),
			),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reminder-for-overdue-payments.form.fields.reminderAmount")),
		prop: "reminderAmount",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.placeholders.reminderAmount"),
			),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reminder-for-overdue-payments.form.fields.reminderMethod")),
		prop: "reminderMethod",
		valueType: "select",
		width: "200px",
		options: reminderMethodOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.placeholders.reminderMethod"),
			),
		},
		required: true,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.reminder-for-overdue-payments.form.fields.reminderStatus")),
		prop: "reminderStatus",
		valueType: "select",
		width: "200px",
		options: reminderStatusOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.placeholders.reminderStatus"),
			),
		},
		required: true,
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	ownerName: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.validation.ownerNameRequired"),
			),
			trigger: "blur",
		},
	],
	paymentObject: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.validation.paymentObjectRequired"),
			),
			trigger: "blur",
		},
	],
	feeName: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.validation.feeNameRequired"),
			),
			trigger: "blur",
		},
	],
	reminderAmount: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.validation.reminderAmountRequired"),
			),
			trigger: "blur",
		},
	],
	reminderMethod: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.validation.reminderMethodRequired"),
			),
			trigger: "change",
		},
	],
	reminderStatus: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.reminder-for-overdue-payments.form.validation.reminderStatusRequired"),
			),
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
