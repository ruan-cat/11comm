<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { ContractFeeType, ContracteChargeFormVO } from "@01s-11comm/type";

import { ContracteChargeFormProps, defaultForm } from "./form";

const props = defineProps<ContracteChargeFormProps>();
const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ContracteChargeFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(cloneDeep(props.form) as FieldValues & ContracteChargeFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 费用类型选项翻译 */
const feeTypeLabelMap = {
	物业费: "property-manage_expense-manage.contracte-charge.form.options.feeType.propertyFee",
	押金: "property-manage_expense-manage.contracte-charge.form.options.feeType.deposit",
	煤气费: "property-manage_expense-manage.contracte-charge.form.options.feeType.gasFee",
	取暖费: "property-manage_expense-manage.contracte-charge.form.options.feeType.heatingFee",
	维修费: "property-manage_expense-manage.contracte-charge.form.options.feeType.maintenanceFee",
	服务费: "property-manage_expense-manage.contracte-charge.form.options.feeType.serviceFee",
	其他: "property-manage_expense-manage.contracte-charge.form.options.feeType.other",
	系统费用: "property-manage_expense-manage.contracte-charge.form.options.feeType.systemFee",
	租金: "property-manage_expense-manage.contracte-charge.form.options.feeType.rent",
} as const;

/** 合同状态选项翻译 */
const contractStatusLabelMap = {
	待审核: "property-manage_expense-manage.contracte-charge.form.options.contractStatus.pending",
	审核中: "property-manage_expense-manage.contracte-charge.form.options.contractStatus.reviewing",
	审核完成: "property-manage_expense-manage.contracte-charge.form.options.contractStatus.completed",
} as const;

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	// 费用类型
	{
		label: transformI18n($t("property-manage_expense-manage.contracte-charge.form.fields.feeType")),
		prop: "feeType",
		valueType: "select",
		options: [
			{ label: transformI18n($t(feeTypeLabelMap["物业费"])), value: "物业费" },
			{ label: transformI18n($t(feeTypeLabelMap["押金"])), value: "押金" },
			{ label: transformI18n($t(feeTypeLabelMap["煤气费"])), value: "煤气费" },
			{ label: transformI18n($t(feeTypeLabelMap["取暖费"])), value: "取暖费" },
			{ label: transformI18n($t(feeTypeLabelMap["维修费"])), value: "维修费" },
			{ label: transformI18n($t(feeTypeLabelMap["服务费"])), value: "服务费" },
			{ label: transformI18n($t(feeTypeLabelMap["其他"])), value: "其他" },
			{ label: transformI18n($t(feeTypeLabelMap["系统费用"])), value: "系统费用" },
			{ label: transformI18n($t(feeTypeLabelMap["租金"])), value: "租金" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	// 收费项目
	{
		label: transformI18n($t("property-manage_expense-manage.contracte-charge.form.fields.chargeItem")),
		prop: "chargeItem",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.contracte-charge.form.placeholders.chargeItem")),
		},
	},

	// 合同状态
	{
		label: transformI18n($t("property-manage_expense-manage.contracte-charge.form.fields.contractStatus")),
		prop: "contractStatus",
		valueType: "select",
		options: [
			{ label: transformI18n($t(contractStatusLabelMap["待审核"])), value: "待审核" },
			{ label: transformI18n($t(contractStatusLabelMap["审核中"])), value: "审核中" },
			{ label: transformI18n($t(contractStatusLabelMap["审核完成"])), value: "审核完成" },
		],
		required: true,
		fieldProps: {
			clearable: true,
		},
	},

	// 计费起始时间
	{
		label: transformI18n($t("property-manage_expense-manage.contracte-charge.form.fields.billingStartTime")),
		prop: "billingStartTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
	},

	// 计费结束时间
	{
		label: transformI18n($t("property-manage_expense-manage.contracte-charge.form.fields.billingEndTime")),
		prop: "billingEndTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	feeType: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.contracte-charge.form.validation.feeTypeRequired")),
			trigger: "change",
		},
	],
	chargeItem: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.contracte-charge.form.validation.chargeItemRequired")),
			trigger: "blur",
		},
	],
	contractStatus: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.contracte-charge.form.validation.contractStatusRequired"),
			),
			trigger: "change",
		},
	],
	billingStartTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.contracte-charge.form.validation.billingStartTimeRequired"),
			),
			trigger: "change",
		},
	],
	billingEndTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.contracte-charge.form.validation.billingEndTimeRequired"),
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
