<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { RepairsSettingFormProps } from "./form";
import type { RepairsSettingFormVO } from "@01s-11comm/type";
import {
	repairsSettingTypeOptions,
	dispatchMethodOptions,
	areaOptions,
	returnVisitSettingOptions,
} from "@01s-11comm/type";

const props = defineProps<RepairsSettingFormProps>();

const { computed } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & RepairsSettingFormVO;

const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & RepairsSettingFormVO;

const form = ref(toRefForm);
const formComputed = computed(() => form.value);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.fields.typeName")),
		prop: "typeName",
		valueType: "input",
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.fields.settingType")),
		prop: "settingType",
		valueType: "select",
		options: repairsSettingTypeOptions,
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.fields.dispatchMethod")),
		prop: "dispatchMethod",
		valueType: "select",
		options: dispatchMethodOptions,
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.fields.publicArea")),
		prop: "publicArea",
		valueType: "select",
		options: areaOptions,
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.fields.ownerDisplay")),
		prop: "ownerDisplay",
		valueType: "select",
		options: [
			{
				label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.options.ownerDisplay.yes")),
				value: "是",
			},
			{
				label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.options.ownerDisplay.no")),
				value: "否",
			},
		],
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.fields.notificationMethod")),
		prop: "notificationMethod",
		valueType: "select",
		options: [
			{
				label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.options.notificationMethod.sms")),
				value: "短信",
			},
			{
				label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.options.notificationMethod.wechat")),
				value: "微信",
			},
			{
				label: transformI18n(
					$t("propertyManage_repairsManage.repairs-setting.form.options.notificationMethod.wechatAndBadge"),
				),
				value: "微信+员工工牌",
			},
		],
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.fields.returnVisitSetting")),
		prop: "returnVisitSetting",
		valueType: "select",
		options: returnVisitSettingOptions,
		required: true,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		required: false,
	},
]);

const plusFormColumnsComputed = computed(() => plusFormColumns.value);

const plusFormRules = computed<PlusFormRules>(() => ({
	typeName: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.validation.typeNameRequired")),
			trigger: "blur",
		},
	],
	settingType: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.validation.settingTypeRequired")),
			trigger: "change",
		},
	],
	dispatchMethod: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.validation.dispatchMethodRequired")),
			trigger: "change",
		},
	],
	publicArea: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.validation.publicAreaRequired")),
			trigger: "change",
		},
	],
	ownerDisplay: [
		{
			required: true,
			message: transformI18n($t("propertyManage_repairsManage.repairs-setting.form.validation.ownerDisplayRequired")),
			trigger: "change",
		},
	],
	notificationMethod: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.repairs-setting.form.validation.notificationMethodRequired"),
			),
			trigger: "change",
		},
	],
	returnVisitSetting: [
		{
			required: true,
			message: transformI18n(
				$t("propertyManage_repairsManage.repairs-setting.form.validation.returnVisitSettingRequired"),
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
	<section class="form-root">
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			:has-footer="false"
			:default-values="defaultValues"
			:columns="plusFormColumnsComputed"
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
