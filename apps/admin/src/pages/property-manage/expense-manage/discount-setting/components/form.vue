<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { discountTypeOptions, ruleOptions } from "@01s-11comm/type";
import { type FieldValues, type PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import type { DiscountSettingFormProps } from "./form";
import type { DiscountSettingFormVO } from "@01s-11comm/type";

const props = defineProps<DiscountSettingFormProps>();

const { locale, computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & DiscountSettingFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & DiscountSettingFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 折扣名称
	{
		label: transformI18n($t("property-manage_expense-manage.discount-setting.form.fields.discountName")),
		prop: "discountName",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},

	// 折扣类型
	{
		label: transformI18n($t("property-manage_expense-manage.discount-setting.form.fields.discountType")),
		prop: "discountType",
		valueType: "select",
		options: discountTypeOptions,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	// 规则
	{
		label: transformI18n($t("property-manage_expense-manage.discount-setting.form.fields.rule")),
		prop: "rule",
		valueType: "select",
		options: ruleOptions,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	// 描述
	{
		label: transformI18n($t("property-manage_expense-manage.discount-setting.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	discountName: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.discount-setting.form.validation.discountNameRequired"),
			),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_expense-manage.discount-setting.form.validation.discountNameLength")),
			trigger: "blur",
		},
	],
	discountType: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.discount-setting.form.validation.discountTypeRequired"),
			),
			trigger: "change",
		},
	],
	rule: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.discount-setting.form.validation.ruleRequired")),
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
