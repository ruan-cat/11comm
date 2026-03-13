<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import type { CommunityInformationFormVO } from "@01s-11comm/type";
import { communityInformationStatusOptions, communitySearchOptions } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type CommunityInformationFormProps } from "./form";

const props = defineProps<CommunityInformationFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & CommunityInformationFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & CommunityInformationFormVO);
const formComputed = computed(() => form.value);

const provinceLabelMap = {
	北京市: "operation-team_data-manage.community-information.options.provinces.beijing",
	上海市: "operation-team_data-manage.community-information.options.provinces.shanghai",
	广州市: "operation-team_data-manage.community-information.options.provinces.guangzhou",
	深圳市: "operation-team_data-manage.community-information.options.provinces.shenzhen",
	杭州市: "operation-team_data-manage.community-information.options.provinces.hangzhou",
} as const;

const cityLabelMap = {
	北京市: "operation-team_data-manage.community-information.options.cities.beijing",
	上海市: "operation-team_data-manage.community-information.options.cities.shanghai",
	广州市: "operation-team_data-manage.community-information.options.cities.guangzhou",
	深圳市: "operation-team_data-manage.community-information.options.cities.shenzhen",
	杭州市: "operation-team_data-manage.community-information.options.cities.hangzhou",
	南京市: "operation-team_data-manage.community-information.options.cities.nanjing",
	武汉市: "operation-team_data-manage.community-information.options.cities.wuhan",
	成都市: "operation-team_data-manage.community-information.options.cities.chengdu",
} as const;

const districtLabelMap = {
	朝阳区: "operation-team_data-manage.community-information.options.districts.chaoyang",
	海淀区: "operation-team_data-manage.community-information.options.districts.haidian",
	东城区: "operation-team_data-manage.community-information.options.districts.dongcheng",
	西城区: "operation-team_data-manage.community-information.options.districts.xicheng",
	丰台区: "operation-team_data-manage.community-information.options.districts.fengtai",
} as const;

const statusLabelMap = {
	正常: "operation-team_data-manage.community-information.options.statuses.normal",
	停用: "operation-team_data-manage.community-information.options.statuses.disabled",
	筹建中: "operation-team_data-manage.community-information.options.statuses.preparing",
	已交付: "operation-team_data-manage.community-information.options.statuses.delivered",
	enabled: "operation-team_data-manage.community-information.options.statuses.enabled",
	disabled: "operation-team_data-manage.community-information.options.statuses.disabled",
} as const;

function translateProvinceLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = provinceLabelMap[value as keyof typeof provinceLabelMap];
	return key ? renderI18n($t(key)) : value;
}

function translateCityLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = cityLabelMap[value as keyof typeof cityLabelMap];
	return key ? renderI18n($t(key)) : value;
}

function translateDistrictLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = districtLabelMap[value as keyof typeof districtLabelMap];
	return key ? renderI18n($t(key)) : value;
}

function translateStatusLabel(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = statusLabelMap[value as keyof typeof statusLabelMap];
	return key ? renderI18n($t(key)) : value;
}

const translatedProvinceOptions = withLocale(() =>
	communitySearchOptions.provinces.map((item) => ({
		...item,
		label: translateProvinceLabel(String(item.value)),
	})),
);

const translatedCityOptions = withLocale(() =>
	communitySearchOptions.cities.map((item) => ({
		...item,
		label: translateCityLabel(String(item.value)),
	})),
);

const translatedDistrictOptions = withLocale(() =>
	communitySearchOptions.districts.map((item) => ({
		...item,
		label: translateDistrictLabel(String(item.value)),
	})),
);

const translatedStatusOptions = withLocale(() =>
	communityInformationStatusOptions.map((item) => ({
		...item,
		label: translateStatusLabel(String(item.value)),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.communityId")),
		prop: "communityId",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.communityId")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.communityName")),
		prop: "communityName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.communityName")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.propertyCompany")),
		prop: "propertyCompany",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.propertyCompany")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.nearbyLandmark")),
		prop: "nearbyLandmark",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.nearbyLandmark")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.province")),
		prop: "province",
		valueType: "select",
		options: translatedProvinceOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.province")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.city")),
		prop: "city",
		valueType: "select",
		options: translatedCityOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.city")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.district")),
		prop: "district",
		valueType: "select",
		options: translatedDistrictOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.district")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.detailedAddress")),
		prop: "detailedAddress",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.detailedAddress")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.contactPhone")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.administrator")),
		prop: "administrator",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.administrator")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.status")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.communityCode")),
		prop: "communityCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.communityCode")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.cityCode")),
		prop: "cityCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.cityCode")),
		},
	},
	{
		label: renderI18n($t("operation-team_data-manage.community-information.fields.createTime")),
		prop: "createTime",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: renderI18n($t("operation-team_data-manage.community-information.placeholders.createTime")),
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	communityName: [
		{
			required: true,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.communityNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.communityNameLength")),
			trigger: "blur",
		},
	],
	propertyCompany: [
		{
			required: true,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.propertyCompanyRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.propertyCompanyLength")),
			trigger: "blur",
		},
	],
	province: [
		{
			required: true,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.provinceRequired")),
			trigger: "change",
		},
	],
	city: [
		{
			required: true,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.cityRequired")),
			trigger: "change",
		},
	],
	district: [
		{
			required: true,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.districtRequired")),
			trigger: "change",
		},
	],
	detailedAddress: [
		{
			required: true,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.detailedAddressRequired")),
			trigger: "blur",
		},
		{
			min: 5,
			max: 100,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.detailedAddressLength")),
			trigger: "blur",
		},
	],
	contactPhone: [
		{
			required: true,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.contactPhoneRequired")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.contactPhoneInvalid")),
			trigger: "blur",
		},
	],
	administrator: [
		{
			required: true,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.administratorRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 20,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.administratorLength")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: renderI18n($t("operation-team_data-manage.community-information.validation.statusRequired")),
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
			:label-width="120"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
