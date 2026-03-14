<!--
  优惠类型表单
  用于新增 修改优惠类型
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { discountTypeOptions, type DiscountTypeFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { DiscountTypeFormProps, defaultForm } from "./form";

const props = defineProps<DiscountTypeFormProps>();

const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & DiscountTypeFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & DiscountTypeFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	/** 折扣名称 */
	{
		label: transformI18n($t("property-manage_expense-manage.discount-type.form.fields.discountName")),
		prop: "discountName",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			disabled: props.disabled,
			placeholder: transformI18n($t("property-manage_expense-manage.discount-type.form.placeholders.discountName")),
		},
	},
	/** 折扣类型 */
	{
		label: transformI18n($t("property-manage_expense-manage.discount-type.form.fields.discountType")),
		prop: "discountType",
		valueType: "select",
		width: "200px",
		options: discountTypeOptions,
		fieldProps: {
			clearable: true,
			disabled: props.disabled,
			placeholder: transformI18n($t("property-manage_expense-manage.discount-type.form.placeholders.discountType")),
		},
	},
	/** 规则名称 */
	{
		label: transformI18n($t("property-manage_expense-manage.discount-type.form.fields.ruleName")),
		prop: "ruleName",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			disabled: props.disabled,
			placeholder: transformI18n($t("property-manage_expense-manage.discount-type.form.placeholders.ruleName")),
		},
	},
	/** 规则 */
	{
		label: transformI18n($t("property-manage_expense-manage.discount-type.form.fields.rule")),
		prop: "rule",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			disabled: props.disabled,
			placeholder: transformI18n($t("property-manage_expense-manage.discount-type.form.placeholders.rule")),
			rows: 4,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	discountName: [
		{
			required: !props.disabled,
			message: transformI18n($t("property-manage_expense-manage.discount-type.form.validation.discountNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_expense-manage.discount-type.form.validation.discountNameLength")),
			trigger: "blur",
		},
	],
	discountType: [
		{
			required: !props.disabled,
			message: transformI18n($t("property-manage_expense-manage.discount-type.form.validation.discountTypeRequired")),
			trigger: "change",
		},
	],
	ruleName: [
		{
			required: !props.disabled,
			message: transformI18n($t("property-manage_expense-manage.discount-type.form.validation.ruleNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_expense-manage.discount-type.form.validation.ruleNameLength")),
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
