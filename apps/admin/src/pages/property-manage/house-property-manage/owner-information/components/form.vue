<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { OwnerInformationFormVO } from "@01s-11comm/type";
import { personTypeOptions, personRoleOptions, genderOptions } from "@01s-11comm/type";
import { OwnerInformationFormProps } from "./form";

const props = defineProps<OwnerInformationFormProps>();
const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OwnerInformationFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & OwnerInformationFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	// 人员类型
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.personnelType")),
		prop: "personnelType",
		valueType: "select",
		options: personTypeOptions,
		required: true,
	},

	// 人员角色
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.personnelRole")),
		prop: "personnelRole",
		valueType: "select",
		options: personRoleOptions,
		required: true,
	},

	// 客户名称
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.customerName")),
		prop: "customerName",
		valueType: "input",
		required: true,
	},

	// 联系手机
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		required: true,
	},

	// 性别
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.gender")),
		prop: "gender",
		valueType: "select",
		options: genderOptions,
		required: true,
	},

	// 备用手机
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.backupPhone")),
		prop: "backupPhone",
		valueType: "input",
	},

	// 地址
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.address")),
		prop: "address",
		valueType: "input",
	},

	// 门禁钥匙
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.accessKey")),
		prop: "accessKey",
		valueType: "input",
	},

	// 身份证
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.idCard")),
		prop: "idCard",
		valueType: "input",
	},

	// 备注
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-information.fields.remark")),
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	personnelType: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.owner-information.form.rules.personnelTypeRequired"),
			),
			trigger: "change",
		},
	],
	personnelRole: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.owner-information.form.rules.personnelRoleRequired"),
			),
			trigger: "change",
		},
	],
	customerName: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.owner-information.form.rules.customerNameRequired"),
			),
			trigger: "blur",
		},
	],
	contactPhone: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.owner-information.form.rules.contactPhoneRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n(
				$t("property-manage_house-property-manage.owner-information.form.rules.contactPhoneFormat"),
			),
			trigger: "blur",
		},
	],
	gender: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-information.form.rules.genderRequired")),
			trigger: "change",
		},
	],
	idCard: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-information.form.rules.idCardRequired")),
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
			:row-props="{ gutter: 20 }"
			:col-props="{
				span: 12,
			}"
			:label-width="100"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
