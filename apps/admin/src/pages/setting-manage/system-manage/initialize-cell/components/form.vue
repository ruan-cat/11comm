<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type InitializeCommunityFormProps } from "./form";
import { type InitializeCommunityFormVO, statusOptions } from "@01s-11comm/type";

type InitializeCommunityFormModel = FieldValues &
	InitializeCommunityFormVO & {
		communityId?: string;
		communityName?: string;
		nearbyLandmark?: string;
		cityCode?: string;
		status?: string;
	};

const props = defineProps<InitializeCommunityFormProps>();
const { withLocale } = useI18nConfig();

function translateStatusLabel(value?: string | null) {
	if (value === "启用") {
		return transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.enabled"));
	}
	if (value === "禁用") {
		return transformI18n($t("settingManage.systemManage.initializeCell.options.statuses.disabled"));
	}
	return value ?? "";
}

const defaultValues = props.defaultValues as InitializeCommunityFormModel;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as InitializeCommunityFormModel);
const formComputed = computed(() => form.value);

const translatedStatusOptions = withLocale(() =>
	statusOptions.map((item) => ({
		...item,
		label: translateStatusLabel(String(item.value)),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.communityId")),
		prop: "communityId",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("settingManage.systemManage.initializeCell.placeholders.communityId")),
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.communityName")),
		prop: "communityName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("settingManage.systemManage.initializeCell.placeholders.communityName")),
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.nearbyLandmark")),
		prop: "nearbyLandmark",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("settingManage.systemManage.initializeCell.placeholders.nearbyLandmark")),
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.cityCode")),
		prop: "cityCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("settingManage.systemManage.initializeCell.placeholders.cityCode")),
		},
	},
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("settingManage.systemManage.initializeCell.placeholders.status")),
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	communityId: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.communityIdRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.communityIdLength")),
			trigger: "blur",
		},
	],
	communityName: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.communityNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.communityNameLength")),
			trigger: "blur",
		},
	],
	nearbyLandmark: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.nearbyLandmarkRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.nearbyLandmarkLength")),
			trigger: "blur",
		},
	],
	cityCode: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.cityCodeRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 100,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.cityCodeLength")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.statusRequired")),
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
