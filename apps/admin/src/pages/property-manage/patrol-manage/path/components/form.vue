<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type PatrolPathFormProps, defaultForm } from "./form";
import type { PatrolPathFormData } from "@01s-11comm/type";
import { patrolPointTypeOptions } from "@01s-11comm/type";

const props = defineProps<PatrolPathFormProps>();
const { locale, computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PatrolPathFormData;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & PatrolPathFormData);
const formComputed = computed(() => form.value);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.path.form.patrolPointName")),
		prop: "patrolPointName",
		valueType: "input",
		fieldProps: {
			readonly: true,
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.path.form.patrolPointType")),
		prop: "patrolPointType",
		valueType: "select",
		options: patrolPointTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.path.form.patrolLocation")),
		prop: "patrolLocation",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.path.form.startTime")),
		prop: "startTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.path.form.endTime")),
		prop: "endTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.path.form.sortOrder")),
		prop: "sortOrder",
		valueType: "input-number",
		fieldProps: {
			min: 0,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	patrolPointName: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.path.form.rules.patrolPointNameRequired")),
			trigger: "blur",
		},
	],
	patrolPointType: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.path.form.rules.patrolPointTypeRequired")),
			trigger: "change",
		},
	],
	patrolLocation: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.path.form.rules.patrolLocationRequired")),
			trigger: "blur",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.path.form.rules.startTimeRequired")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.path.form.rules.endTimeRequired")),
			trigger: "change",
		},
	],
	sortOrder: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.path.form.rules.sortOrderRequired")),
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
	<section :key="locale" class="form-root">
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
