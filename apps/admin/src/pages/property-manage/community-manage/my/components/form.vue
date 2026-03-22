<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import type { CommunityManageMyFormVO } from "@01s-11comm/type";
import type { CommunityManageMyFormProps } from "./form";

const props = defineProps<CommunityManageMyFormProps>();

const defaultValues = props.defaultValues as FieldValues & CommunityManageMyFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & CommunityManageMyFormVO);
const formComputed = computed(() => form.value);

const provinceLabelKeyMap = {
	福建省: "propertyManage_communityManage.my.options.province.fujian",
	广东省: "propertyManage_communityManage.my.options.province.guangdong",
	浙江省: "propertyManage_communityManage.my.options.province.zhejiang",
	江苏省: "propertyManage_communityManage.my.options.province.jiangsu",
	北京市: "propertyManage_communityManage.my.options.province.beijing",
	上海市: "propertyManage_communityManage.my.options.province.shanghai",
	四川省: "propertyManage_communityManage.my.options.province.sichuan",
	湖北省: "propertyManage_communityManage.my.options.province.hubei",
	山东省: "propertyManage_communityManage.my.options.province.shandong",
	湖南省: "propertyManage_communityManage.my.options.province.hunan",
	河北省: "propertyManage_communityManage.my.options.province.hebei",
	河南省: "propertyManage_communityManage.my.options.province.henan",
	江西省: "propertyManage_communityManage.my.options.province.jiangxi",
	安徽省: "propertyManage_communityManage.my.options.province.anhui",
} as const;

const statusLabelKeyMap = {
	operating: "propertyManage_communityManage.my.options.status.operating",
	preparing: "propertyManage_communityManage.my.options.status.preparing",
	maintenance: "propertyManage_communityManage.my.options.status.maintenance",
	disabled: "propertyManage_communityManage.my.options.status.disabled",
} as const;

const provinceOptions = computed(() =>
	Object.entries(provinceLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const statusOptions = computed(() =>
	Object.entries(statusLabelKeyMap).map(([value, key]) => ({
		label: transformI18n($t(key)),
		value,
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.name")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.code")),
		prop: "code",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.code")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.province")),
		prop: "province",
		valueType: "select",
		options: provinceOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.province")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.city")),
		prop: "city",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.city")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.district")),
		prop: "district",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.district")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.servicePhone")),
		prop: "servicePhone",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.servicePhone")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.area")),
		prop: "area",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.area")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.startTime")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.endTime")),
			disabled: props.mode === "info",
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.my.fields.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions.value,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("propertyManage_communityManage.my.form.placeholders.status")),
			disabled: props.mode === "info",
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.enterName")),
			trigger: "blur",
		},
	],
	code: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.enterCode")),
			trigger: "blur",
		},
		{
			pattern: /^([A-Z]{2}|[A-Z]{3})\d{3}$/,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.codePattern")),
			trigger: "blur",
		},
	],
	province: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.selectProvince")),
			trigger: "change",
		},
	],
	city: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.enterCity")),
			trigger: "blur",
		},
	],
	district: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.enterDistrict")),
			trigger: "blur",
		},
	],
	servicePhone: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.enterServicePhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.servicePhonePattern")),
			trigger: "blur",
		},
	],
	area: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.enterArea")),
			trigger: "blur",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.selectStartTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.selectEndTime")),
			trigger: "change",
		},
		{
			validator: (_rule: any, value: string, callback: (error?: Error) => void) => {
				if (value && form.value.startTime && new Date(value) <= new Date(form.value.startTime)) {
					callback(
						new Error(transformI18n($t("propertyManage_communityManage.my.form.validation.endTimeAfterStartTime"))),
					);
					return;
				}

				callback();
			},
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.my.form.validation.selectStatus")),
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
