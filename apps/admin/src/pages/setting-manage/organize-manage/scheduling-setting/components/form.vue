<script lang="ts" setup>
import { useTemplateRef, computed, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

import { type SchedulingSettingFormProps } from "./form";
import { type SchedulingSettingFormVO, schedulingTypeOptions, schedulingStatusOptions } from "@01s-11comm/type";

const props = defineProps<SchedulingSettingFormProps>();
const { t } = useI18n();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & SchedulingSettingFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = cloneDeep(props.form) as FieldValues & SchedulingSettingFormVO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(toRefForm);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedSchedulingTypeOptions = computed(() =>
	schedulingTypeOptions.map((option) => ({
		...option,
		label: transformI18n(t(`settingManage.organizeManage.schedulingSetting.form.options.type.${option.value}`)),
	})),
);

const translatedSchedulingStatusOptions = computed(() =>
	schedulingStatusOptions.map((option) => ({
		...option,
		label: transformI18n(
			t(
				`settingManage.organizeManage.schedulingSetting.form.options.status.${
					option.value === "enabled" ? "enabled" : "disabled"
				}`,
			),
		),
	})),
);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n(t("settingManage.organizeManage.schedulingSetting.fields.name")),
		prop: "name",
		valueType: "input",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.schedulingSetting.fields.type")),
		prop: "type",
		valueType: "select",
		options: translatedSchedulingTypeOptions.value,
	},
	{
		label: transformI18n(t("settingManage.organizeManage.schedulingSetting.fields.cycle")),
		prop: "cycle",
		valueType: "input-number",
		fieldProps: {
			min: 1,
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.schedulingSetting.fields.effectiveTime")),
		prop: "effectiveTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.schedulingSetting.fields.staff")),
		prop: "staff",
		valueType: "input",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.schedulingSetting.fields.status")),
		prop: "status",
		valueType: "select",
		options: translatedSchedulingStatusOptions.value,
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.schedulingSetting.form.validation.enterName")),
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.schedulingSetting.form.validation.selectType")),
			trigger: "change",
		},
	],
	cycle: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.schedulingSetting.form.validation.enterCycle")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			message: transformI18n(t("settingManage.organizeManage.schedulingSetting.form.validation.cyclePositive")),
			trigger: "blur",
		},
	],
	effectiveTime: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.schedulingSetting.form.validation.selectEffectiveTime")),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.schedulingSetting.form.validation.selectStatus")),
			trigger: "change",
		},
	],
}));

/** 对外导出 */
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
