<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { type SchedulingSettingFormProps } from "./form";
import { type SchedulingSettingFormVO, schedulingStatusOptions, schedulingTypeOptions } from "@01s-11comm/type";

const props = defineProps<SchedulingSettingFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & SchedulingSettingFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & SchedulingSettingFormVO);
const formComputed = computed(() => form.value);

const translatedSchedulingTypeOptions = withLocale(() =>
	schedulingTypeOptions.map((option) => ({
		...option,
		label: renderI18n($t(`settingManage.organizeManage.schedulingSetting.form.options.type.${option.value}`)),
	})),
);

const translatedSchedulingStatusOptions = withLocale(() =>
	schedulingStatusOptions.map((option) => ({
		...option,
		label: renderI18n($t(`settingManage.organizeManage.schedulingSetting.form.options.status.${option.value}`)),
	})),
);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.name")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.type")),
		prop: "type",
		valueType: "select",
		options: translatedSchedulingTypeOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.type")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.cycle")),
		prop: "cycle",
		valueType: "input-number",
		fieldProps: {
			min: 1,
			placeholder: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.cycle")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.effectiveTime")),
		prop: "effectiveTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.effectiveTime")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.staff")),
		prop: "staff",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.staff")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedSchedulingStatusOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.schedulingSetting.fields.status")),
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.schedulingSetting.form.validation.enterName")),
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.schedulingSetting.form.validation.selectType")),
			trigger: "change",
		},
	],
	cycle: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.schedulingSetting.form.validation.enterCycle")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			message: renderI18n($t("settingManage.organizeManage.schedulingSetting.form.validation.cyclePositive")),
			trigger: "blur",
		},
	],
	effectiveTime: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.schedulingSetting.form.validation.selectEffectiveTime")),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.schedulingSetting.form.validation.selectStatus")),
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
