<!--
  商户管理员表单
  用于新增 修改商户管理员信息
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { propertyCompanyOptions, statusOptions, type MerchantAdminFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { MerchantAdminFormProps } from "./form";

const props = defineProps<MerchantAdminFormProps>();
const { locale, computed } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & MerchantAdminFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & MerchantAdminFormVO);
const formComputed = computed(() => form.value);

const propertyCompanyLabelKeyMap = {
	示例物业公司1: $t("operation-team_merchant-manage.merchant-admin.options.propertyCompany.company1"),
	示例物业公司2: $t("operation-team_merchant-manage.merchant-admin.options.propertyCompany.company2"),
} as const;

const accountStatusLabelKeyMap = {
	启用: $t("operation-team_merchant-manage.merchant-admin.options.accountStatus.enabled"),
	禁用: $t("operation-team_merchant-manage.merchant-admin.options.accountStatus.disabled"),
	enabled: $t("operation-team_merchant-manage.merchant-admin.options.accountStatus.enabled"),
	disabled: $t("operation-team_merchant-manage.merchant-admin.options.accountStatus.disabled"),
} as const;

function translatePropertyCompany(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = propertyCompanyLabelKeyMap[value as keyof typeof propertyCompanyLabelKeyMap];
	return key ? transformI18n(key) : value;
}

function translateAccountStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = accountStatusLabelKeyMap[value as keyof typeof accountStatusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const translatedPropertyCompanyOptions = computed(() =>
	propertyCompanyOptions.map((option) => ({
		...option,
		label: translatePropertyCompany(String(option.value)),
	})),
);

const translatedStatusOptions = computed(() =>
	statusOptions.map((option) => ({
		...option,
		label: translateAccountStatus(String(option.value)),
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.propertyCompany")),
		prop: "propertyCompany",
		valueType: "select",
		options: translatedPropertyCompanyOptions.value,
		width: "300px",
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.propertyCompany")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.adminName")),
		prop: "adminName",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.adminName")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.adminPhone")),
		prop: "adminPhone",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.adminPhone")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.adminEmail")),
		prop: "adminEmail",
		valueType: "input",
		width: "250px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.adminEmail")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.idCardNo")),
		prop: "idCardNo",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.idCardNo")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.accountStatus")),
		prop: "accountStatus",
		valueType: "select",
		options: translatedStatusOptions.value,
		width: "150px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.accountStatus")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.loginPassword")),
		prop: "loginPassword",
		valueType: "input",
		width: "200px",
		fieldProps: {
			type: "password",
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.loginPassword")),
			showPassword: true,
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.confirmPassword")),
		prop: "confirmPassword",
		valueType: "input",
		width: "200px",
		fieldProps: {
			type: "password",
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.confirmPassword")),
			showPassword: true,
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.contactAddress")),
		prop: "contactAddress",
		valueType: "input",
		width: "400px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.contactAddress")),
		},
	},
	{
		label: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.fields.remarks")),
		prop: "remarks",
		valueType: "textarea",
		width: "400px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.placeholders.remarks")),
			rows: 3,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	propertyCompany: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.selectPropertyCompany")),
			trigger: "change",
		},
	],
	adminName: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.enterAdminName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 20,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.adminNameLength")),
			trigger: "blur",
		},
	],
	adminPhone: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.enterAdminPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.adminPhonePattern")),
			trigger: "blur",
		},
	],
	adminEmail: [
		{
			type: "email",
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.adminEmailPattern")),
			trigger: "blur",
		},
	],
	idCardNo: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.enterIdCardNo")),
			trigger: "blur",
		},
		{
			pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.idCardNoPattern")),
			trigger: "blur",
		},
	],
	accountStatus: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.selectAccountStatus")),
			trigger: "change",
		},
	],
	loginPassword: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.enterLoginPassword")),
			trigger: "blur",
		},
		{
			min: 6,
			max: 20,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.loginPasswordLength")),
			trigger: "blur",
		},
	],
	confirmPassword: [
		{
			required: true,
			message: transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.enterConfirmPassword")),
			trigger: "blur",
		},
		{
			validator: (rule: any, value: string, callback: any) => {
				if (value !== (form.value as Record<string, unknown>).loginPassword) {
					callback(
						new Error(
							transformI18n($t("operation-team_merchant-manage.merchant-admin.form.validation.passwordMismatch")),
						),
					);
				} else {
					callback();
				}
			},
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
