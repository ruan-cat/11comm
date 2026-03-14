<script setup lang="ts">
import { cloneDeep } from "@pureadmin/utils";
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { ChangePasswordRecordFormProps } from "./form";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";
import {
	changePasswordRecordDepartmentOptions,
	changePasswordRecordStatusOptions,
	changePasswordRecordTypeOptions,
	type ChangePasswordRecord,
} from "@01s-11comm/type";

const props = defineProps<ChangePasswordRecordFormProps>();
const { locale, withLocale } = useI18nConfig();

function translateFromRecord(record: Record<string, string>, value?: string | null) {
	if (!value) {
		return "";
	}
	return record[value] ?? value;
}

const departmentTextMap = withLocale(() => ({
	物业团队: transformI18n($t("settingManage.systemManage.changePassword.options.departments.property")),
	开发团队: transformI18n($t("settingManage.systemManage.changePassword.options.departments.development")),
	运营团队: transformI18n($t("settingManage.systemManage.changePassword.options.departments.operation")),
	财务部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.finance")),
	客服部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.customer")),
	维修部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.maintenance")),
	安保部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.security")),
	绿化部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.greening")),
	未知部门: transformI18n($t("settingManage.systemManage.changePassword.options.departments.unknown")),
}));

const changeTypeTextMap = withLocale(() => ({
	用户自行修改: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.selfService")),
	管理员重置: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.adminReset")),
	强制修改: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.forceChange")),
	首次登录修改: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.firstLogin")),
	首次设置: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.firstSetup")),
	主动修改: transformI18n($t("settingManage.systemManage.changePassword.options.changeTypes.activeChange")),
}));

const statusTextMap = withLocale(() => ({
	成功: transformI18n($t("settingManage.systemManage.changePassword.options.statuses.success")),
	失败: transformI18n($t("settingManage.systemManage.changePassword.options.statuses.failed")),
	待审核: transformI18n($t("settingManage.systemManage.changePassword.options.statuses.pending")),
}));

function translateDepartmentLabel(value?: string | null) {
	return translateFromRecord(departmentTextMap.value, value);
}

function translateChangeTypeLabel(value?: string | null) {
	return translateFromRecord(changeTypeTextMap.value, value);
}

function translateStatusLabel(value?: string | null) {
	return translateFromRecord(statusTextMap.value, value);
}

function createRequiredMessage(fieldLabel: string, select = false) {
	return locale.value === "en"
		? `${select ? "Please select " : "Please enter "}${fieldLabel}`
		: `${select ? "请选择" : "请输入"}${fieldLabel}`;
}

function createLengthMessage(fieldLabel: string, min: number, max: number) {
	return locale.value === "en"
		? `${fieldLabel} length must be between ${min} and ${max} characters`
		: `${fieldLabel}长度应在 ${min} 到 ${max} 个字符之间`;
}

const translatedDepartmentOptions = withLocale(() =>
	changePasswordRecordDepartmentOptions.map((item) => ({
		...item,
		label: translateDepartmentLabel(String(item.value)),
	})),
);

const translatedChangeTypeOptions = withLocale(() =>
	changePasswordRecordTypeOptions.map((item) => ({
		...item,
		label: translateChangeTypeLabel(String(item.value)),
	})),
);

const translatedStatusOptions = withLocale(() =>
	changePasswordRecordStatusOptions.map((item) => ({
		...item,
		label: translateStatusLabel(String(item.value)),
	})),
);

const defaultValues = props.defaultValues as FieldValues & ChangePasswordRecord;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & ChangePasswordRecord);
const formComputed = computed(() => form.value);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.recordId")),
		prop: "id",
		valueType: "input",
		fieldProps: {
			disabled: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.username")),
		prop: "username",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.realName")),
		prop: "realName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.department")),
		prop: "department",
		valueType: "select",
		options: translatedDepartmentOptions.value,
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.changeTime")),
		prop: "changeTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.changeIp")),
		prop: "changeIp",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.changeType")),
		prop: "changeType",
		valueType: "select",
		options: translatedChangeTypeOptions.value,
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.operator")),
		prop: "operator",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.changePassword.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
			clearable: true,
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => {
	const usernameLabel = transformI18n($t("settingManage.systemManage.changePassword.fields.username"));
	const realNameLabel = transformI18n($t("settingManage.systemManage.changePassword.fields.realName"));
	const departmentLabel = transformI18n($t("settingManage.systemManage.changePassword.fields.department"));
	const changeTimeLabel = transformI18n($t("settingManage.systemManage.changePassword.fields.changeTime"));
	const changeTypeLabel = transformI18n($t("settingManage.systemManage.changePassword.fields.changeType"));
	const statusLabel = transformI18n($t("settingManage.systemManage.changePassword.fields.status"));

	return {
		username: [
			{ required: true, message: createRequiredMessage(usernameLabel), trigger: "blur" },
			{ min: 3, max: 20, message: createLengthMessage(usernameLabel, 3, 20), trigger: "blur" },
		],
		realName: [
			{ required: true, message: createRequiredMessage(realNameLabel), trigger: "blur" },
			{ min: 2, max: 10, message: createLengthMessage(realNameLabel, 2, 10), trigger: "blur" },
		],
		department: [{ required: true, message: createRequiredMessage(departmentLabel, true), trigger: "change" }],
		changeTime: [{ required: true, message: createRequiredMessage(changeTimeLabel, true), trigger: "change" }],
		changeType: [{ required: true, message: createRequiredMessage(changeTypeLabel, true), trigger: "change" }],
		status: [{ required: true, message: createRequiredMessage(statusLabel, true), trigger: "change" }],
	};
});

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
