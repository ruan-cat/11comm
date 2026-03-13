<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { organizationTypeOptions, type OrganizationInfoFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { OrganizationInfoFormProps } from "./form";

const props = defineProps<OrganizationInfoFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & OrganizationInfoFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & OrganizationInfoFormVO);
const formComputed = computed(() => form.value);

const translatedOrganizationTypeOptions = withLocale(() =>
	organizationTypeOptions.map((option) => ({
		...option,
		label: renderI18n($t(`settingManage.organizeManage.orgInfo.form.options.${option.value}`)),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("settingManage.organizeManage.orgInfo.fields.name")),
		prop: "name",
		valueType: "input",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.orgInfo.fields.type")),
		prop: "type",
		valueType: "select",
		options: translatedOrganizationTypeOptions.value,
	},
	{
		label: renderI18n($t("settingManage.organizeManage.orgInfo.fields.code")),
		prop: "code",
		valueType: "input",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.orgInfo.fields.leaderName")),
		prop: "leaderName",
		valueType: "input",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.orgInfo.fields.phone")),
		prop: "phone",
		valueType: "input",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.orgInfo.fields.description")),
		prop: "description",
		valueType: "textarea",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.orgInfo.fields.enabled")),
		prop: "enabled",
		valueType: "switch",
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.orgInfo.form.validation.enterName")),
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.orgInfo.form.validation.selectType")),
			trigger: "change",
		},
	],
	code: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.orgInfo.form.validation.enterCode")),
			trigger: "blur",
		},
	],
	leaderName: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.orgInfo.form.validation.enterLeaderName")),
			trigger: "blur",
		},
	],
	phone: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.orgInfo.form.validation.enterPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: renderI18n($t("settingManage.organizeManage.orgInfo.form.validation.invalidPhone")),
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
