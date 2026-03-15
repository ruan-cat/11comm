<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { DiscountApplyFormVO } from "@01s-11comm/type";
import { type FieldValues, type PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { DiscountApplyFormProps, defaultForm } from "./form";

const props = defineProps<DiscountApplyFormProps>();

const { locale, computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & DiscountApplyFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & DiscountApplyFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 房屋
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.form.fields.house")),
		prop: "house",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},

	// 申请类型
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.form.fields.applicationType")),
		prop: "applicationType",
		valueType: "select",
		options: [
			{
				label: transformI18n(
					$t("property-manage_expense-manage.discount-apply.form.options.applicationType.vacantHouse"),
				),
				value: "空置房",
			},
			{
				label: transformI18n(
					$t("property-manage_expense-manage.discount-apply.form.options.applicationType.difficultFamily"),
				),
				value: "困难家庭",
			},
			{
				label: transformI18n(
					$t("property-manage_expense-manage.discount-apply.form.options.applicationType.longTermResident"),
				),
				value: "长期住户",
			},
			{
				label: transformI18n(
					$t("property-manage_expense-manage.discount-apply.form.options.applicationType.specialContribution"),
				),
				value: "特殊贡献",
			},
		],
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	// 费用项目
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.form.fields.expenseItem")),
		prop: "expenseItem",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},

	// 申请人
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.form.fields.applicant")),
		prop: "applicant",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	// 申请电话
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.form.fields.applicantPhone")),
		prop: "applicantPhone",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
	// 开始时间
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.form.fields.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	// 结束时间
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.form.fields.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	// 申请名说明
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		required: true,
	},
	// 图片材料
	{
		label: transformI18n($t("property-manage_expense-manage.discount-apply.form.fields.material")),
		prop: "material",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({}));

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
