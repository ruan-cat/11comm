<!--
  场地管理表单
  用于新增 修改场地管理
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import type { SiteManagementFormVO } from "@01s-11comm/type";
import { siteManagementStatusOptions } from "@01s-11comm/type";
import type { SiteManagementFormProps } from "./form";

const props = defineProps<SiteManagementFormProps>();

const { locale, computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & SiteManagementFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & SiteManagementFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 编号
	{
		label: transformI18n($t("property-manage_house-property-manage.site-management.form.fields.idNumber")),
		prop: "idNumber",
		valueType: "input",
		required: true,
	},

	// 名称
	{
		label: transformI18n($t("property-manage_house-property-manage.site-management.form.fields.name")),
		prop: "name",
		valueType: "input",
		required: true,
	},

	// 开场时间
	{
		label: transformI18n($t("property-manage_house-property-manage.site-management.form.fields.openingTime")),
		prop: "openingTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
		required: true,
	},

	// 关场时间
	{
		label: transformI18n($t("property-manage_house-property-manage.site-management.form.fields.closingTime")),
		prop: "closingTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
		required: true,
	},

	// 每小时费用
	{
		label: transformI18n($t("property-manage_house-property-manage.site-management.form.fields.hourlyFee")),
		prop: "hourlyFee",
		valueType: "input",
		required: true,
	},

	// 管理员
	{
		label: transformI18n($t("property-manage_house-property-manage.site-management.form.fields.administrator")),
		prop: "administrator",
		valueType: "input",
		required: true,
	},

	// 管理员电话
	{
		label: transformI18n($t("property-manage_house-property-manage.site-management.form.fields.administratorPhone")),
		prop: "administratorPhone",
		valueType: "input",
		required: true,
	},

	// 状态
	{
		label: transformI18n($t("property-manage_house-property-manage.site-management.form.fields.status")),
		prop: "status",
		valueType: "select",
		options: siteManagementStatusOptions,
		required: true,
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	idNumber: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.site-management.form.validation.idNumberRequired"),
			),
			trigger: "blur",
		},
	],
	name: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.site-management.form.validation.nameRequired")),
			trigger: "blur",
		},
	],
	openingTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.site-management.form.validation.openingTimeRequired"),
			),
			trigger: "change",
		},
	],
	closingTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.site-management.form.validation.closingTimeRequired"),
			),
			trigger: "change",
		},
	],
	hourlyFee: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.site-management.form.validation.hourlyFeeRequired"),
			),
			trigger: "blur",
		},
	],
	administrator: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.site-management.form.validation.administratorRequired"),
			),
			trigger: "blur",
		},
	],
	administratorPhone: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.site-management.form.validation.administratorPhoneRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n(
				$t("property-manage_house-property-manage.site-management.form.validation.administratorPhoneFormat"),
			),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.site-management.form.validation.statusRequired"),
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
