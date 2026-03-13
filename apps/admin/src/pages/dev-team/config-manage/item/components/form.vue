<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import type { ConfigItemFormVO } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { ConfigItemFormProps } from "./form";
import { configItemTypeOptions, itemEnableStatusOptions } from "@01s-11comm/type";
import { useI18nConfig } from "@/composables/use-i18n-config";

const props = defineProps<ConfigItemFormProps>();
const { locale, withLocale } = useI18nConfig();

const configItemTypeLabelKeyMap = {
	system: "devTeam.configManage.item.form.options.system",
	business: "devTeam.configManage.item.form.options.business",
	api: "devTeam.configManage.item.form.options.api",
	database: "devTeam.configManage.item.form.options.database",
	cache: "devTeam.configManage.item.form.options.cache",
	log: "devTeam.configManage.item.form.options.log",
	security: "devTeam.configManage.item.form.options.security",
	notification: "devTeam.configManage.item.form.options.notification",
} as const;

const enableStatusLabelKeyMap = {
	enabled: "devTeam.configManage.item.form.options.enabled",
	disabled: "devTeam.configManage.item.form.options.disabled",
} as const;

const defaultValues = props.defaultValues as FieldValues & ConfigItemFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const toRefForm = cloneDeep(props.form) as FieldValues & ConfigItemFormVO;
const form = ref(toRefForm);

const formComputed = computed(() => {
	return form.value;
});

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const translatedConfigItemTypeOptions = withLocale(() =>
	configItemTypeOptions.map((option) => ({
		...option,
		label: renderI18n($t(configItemTypeLabelKeyMap[String(option.value) as keyof typeof configItemTypeLabelKeyMap])),
	})),
);

const translatedItemEnableStatusOptions = withLocale(() =>
	itemEnableStatusOptions.map((option) => ({
		...option,
		label: renderI18n($t(enableStatusLabelKeyMap[String(option.value) as keyof typeof enableStatusLabelKeyMap])),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("devTeam.configManage.item.fields.configName")),
		prop: "configItemName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: renderI18n($t("devTeam.configManage.item.fields.configCode")),
		prop: "configItemCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: renderI18n($t("devTeam.configManage.item.fields.configType")),
		prop: "configItemType",
		valueType: "select",
		options: translatedConfigItemTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		required: true,
	},
	{
		label: renderI18n($t("devTeam.configManage.item.fields.configValue")),
		prop: "configItemValue",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: renderI18n($t("devTeam.configManage.item.fields.description")),
		prop: "configItemDescription",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: renderI18n($t("devTeam.configManage.item.fields.isEnabled")),
		prop: "isEnabled",
		valueType: "select",
		options: translatedItemEnableStatusOptions.value,
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: renderI18n($t("devTeam.configManage.center.fields.remark")),
		prop: "remark",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	configItemName: [
		{ required: true, message: renderI18n($t("devTeam.configManage.item.form.validation.enterConfigItemName")), trigger: "blur" },
		{ min: 2, max: 50, message: renderI18n($t("devTeam.configManage.item.form.validation.configItemNameLength")), trigger: "blur" },
	],
	configItemCode: [
		{ required: true, message: renderI18n($t("devTeam.configManage.item.form.validation.enterConfigItemCode")), trigger: "blur" },
		{ min: 2, max: 50, message: renderI18n($t("devTeam.configManage.item.form.validation.configItemCodeLength")), trigger: "blur" },
		{
			pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
			message: renderI18n($t("devTeam.configManage.item.form.validation.configItemCodePattern")),
			trigger: "blur",
		},
	],
	configItemType: [{ required: true, message: renderI18n($t("devTeam.configManage.item.form.validation.selectConfigItemType")), trigger: "change" }],
	configItemValue: [
		{ required: true, message: renderI18n($t("devTeam.configManage.item.form.validation.enterConfigItemValue")), trigger: "blur" },
		{ min: 1, max: 500, message: renderI18n($t("devTeam.configManage.item.form.validation.configItemValueLength")), trigger: "blur" },
	],
	isEnabled: [{ required: true, message: renderI18n($t("devTeam.configManage.item.form.validation.selectIsEnabled")), trigger: "change" }],
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
