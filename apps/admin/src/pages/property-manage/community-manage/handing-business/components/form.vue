<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import type { HandingBusinessFormVO } from "@01s-11comm/type";
import type { HandingBusinessFormProps } from "./form";

const props = defineProps<HandingBusinessFormProps>();
const { locale, computed } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & HandingBusinessFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & HandingBusinessFormVO;
const form = ref(toRefForm);
const formComputed = computed(() => form.value);

const feeTypeLabelKeyMap = {
	periodic: "propertyManage_communityManage.handing-business.options.feeType.periodic",
	temporary: "propertyManage_communityManage.handing-business.options.feeType.temporary",
	deposit: "propertyManage_communityManage.handing-business.options.feeType.deposit",
	penalty: "propertyManage_communityManage.handing-business.options.feeType.penalty",
} as const;

const statusLabelKeyMap = {
	pending: "propertyManage_communityManage.handing-business.options.status.pending",
	paid: "propertyManage_communityManage.handing-business.options.status.paid",
	overdue: "propertyManage_communityManage.handing-business.options.status.overdue",
	reduced: "propertyManage_communityManage.handing-business.options.status.reduced",
	voided: "propertyManage_communityManage.handing-business.options.status.voided",
} as const;

const feeTypeOptions = computed(() =>
	Object.entries(feeTypeLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const statusOptions = computed(() =>
	Object.entries(statusLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.handing-business.fields.feeItem")),
		prop: "feeItem",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.handing-business.form.placeholders.feeItem")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.handing-business.fields.feeId")),
		prop: "feeId",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.handing-business.form.placeholders.feeId")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.handing-business.fields.feeType")),
		prop: "feeType",
		valueType: "select",
		options: feeTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.handing-business.form.placeholders.feeType")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.handing-business.fields.amountReceivable")),
		prop: "amountReceivable",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("propertyManage_communityManage.handing-business.form.placeholders.amountReceivable"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.handing-business.fields.accountCreationTime")),
		prop: "accountCreationTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n(
				$t("propertyManage_communityManage.handing-business.form.placeholders.accountCreationTime"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.handing-business.fields.receivablePeriod")),
		prop: "receivablePeriod",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("propertyManage_communityManage.handing-business.form.placeholders.receivablePeriod"),
			),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.handing-business.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
			placeholder: transformI18n($t("propertyManage_communityManage.handing-business.form.placeholders.description")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.handing-business.fields.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.handing-business.form.placeholders.status")),
			disabled: props.mode === "info",
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	feeItem: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.handing-business.form.validation.enterFeeItem")),
			trigger: "blur",
		},
	],
	feeId: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.handing-business.form.validation.enterFeeId")),
			trigger: "blur",
		},
	],
	feeType: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.handing-business.form.validation.selectFeeType")),
			trigger: "change",
		},
	],
	amountReceivable: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_communityManage.handing-business.form.validation.enterAmountReceivable"),
			),
			trigger: "blur",
		},
		{
			pattern: /^\d+(\.\d{1,2})?$/,
			message: transformI18n(
				$t("propertyManage_communityManage.handing-business.form.validation.amountReceivablePattern"),
			),
			trigger: "blur",
		},
	],
	accountCreationTime: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_communityManage.handing-business.form.validation.selectAccountCreationTime"),
			),
			trigger: "change",
		},
	],
	receivablePeriod: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_communityManage.handing-business.form.validation.enterReceivablePeriod"),
			),
			trigger: "blur",
		},
	],
	description: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.handing-business.form.validation.enterDescription")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.handing-business.form.validation.selectStatus")),
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
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
