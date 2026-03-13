<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { RolePermissionFormProps } from "./form";
import type { RolePermissionFormVO } from "@01s-11comm/type";

const props = defineProps<RolePermissionFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & RolePermissionFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & RolePermissionFormVO);
const formComputed = computed(() => form.value);

const translatedStatusOptions = withLocale(() => [
	{ label: renderI18n($t("settingManage.organizeManage.rolePermission.status.enabled")), value: true },
	{ label: renderI18n($t("settingManage.organizeManage.rolePermission.status.disabled")), value: false },
]);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("settingManage.organizeManage.rolePermission.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.rolePermission.fields.name")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.rolePermission.fields.code")),
		prop: "code",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.rolePermission.fields.code")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.rolePermission.fields.status")),
		prop: "enabled",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.rolePermission.fields.status")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.rolePermission.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: renderI18n($t("settingManage.organizeManage.rolePermission.fields.description")),
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.rolePermission.form.validation.enterName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: renderI18n($t("settingManage.organizeManage.rolePermission.form.validation.nameLength")),
			trigger: "blur",
		},
	],
	code: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.rolePermission.form.validation.enterCode")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Z][A-Z0-9_]*$/,
			message: renderI18n($t("settingManage.organizeManage.rolePermission.form.validation.codePattern")),
			trigger: "blur",
		},
	],
	enabled: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.rolePermission.form.validation.selectStatus")),
			trigger: "change",
		},
	],
	description: [
		{
			max: 200,
			message: renderI18n($t("settingManage.organizeManage.rolePermission.form.validation.descriptionMax")),
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
