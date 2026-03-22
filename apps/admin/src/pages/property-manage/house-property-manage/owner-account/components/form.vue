<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { OwnerAccountFormVO } from "@01s-11comm/type";
import { accountTypeOptions, paymentMethodOptions } from "@01s-11comm/type";
import type { OwnerAccountFormProps } from "./form";

/** 表单组件props */
const props = defineProps<OwnerAccountFormProps>();
const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OwnerAccountFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & OwnerAccountFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-account.fields.accountType")),
		prop: "accountType",
		valueType: "select",
		options: accountTypeOptions,
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.placeholder.selectAccountType"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-account.fields.ownerPhone")),
		prop: "ownerPhone",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.placeholder.enterOwnerPhone"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-account.fields.ownerName")),
		prop: "ownerName",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.placeholder.enterOwnerName"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-account.fields.prepaidAmount")),
		prop: "prepaidAmount",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.placeholder.enterPrepaidAmount"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-account.fields.paymentMethod")),
		prop: "paymentMethod",
		valueType: "select",
		options: paymentMethodOptions,
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.placeholder.selectPaymentMethod"),
			),
		},
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-account.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			placeholder: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.placeholder.enterRemark"),
			),
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	accountType: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.validation.selectAccountType"),
			),
			trigger: "change",
		},
	],
	ownerPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-account.form.validation.enterOwnerPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.validation.ownerPhonePattern"),
			),
			trigger: "blur",
		},
	],
	ownerName: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-account.form.validation.enterOwnerName")),
			trigger: "blur",
		},
	],
	prepaidAmount: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.validation.enterPrepaidAmount"),
			),
			trigger: "blur",
		},
		{
			pattern: /^\d+(\.\d{1,2})?$/,
			message: transformI18n(
				$t("property-manage_house-property-manage.owner-account.form.validation.prepaidAmountPattern"),
			),
			trigger: "blur",
		},
	],
}));

// 默认导出表单实例和计算属性
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
