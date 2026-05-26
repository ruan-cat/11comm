<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { type ConfigItemFormProps, type DictionaryItemFormData } from "./form";

const props = defineProps<ConfigItemFormProps>();

const defaultValues = props.defaultValues as FieldValues & DictionaryItemFormData;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/** 克隆 props.form 后再交给 PlusForm，避免弹窗内编辑直接污染列表行对象。 */
const form = ref(cloneDeep(props.form) as FieldValues & DictionaryItemFormData);

/** 暴露给弹窗关闭前比较和提交 payload 读取，保持和 PlusForm 当前值同步。 */
const formComputed = computed(() => {
	return form.value;
});

/** 是否默认项的 select 展示中文 label，但提交给接口的 isDefault 仍是 boolean。 */
const booleanOptions = computed(() => [
	{
		label: transformI18n($t("devTeam.menuManage.item.form.options.yes")),
		value: true,
	},
	{
		label: transformI18n($t("devTeam.menuManage.item.form.options.no")),
		value: false,
	},
]);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryCode")),
		prop: "dictionaryId",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configName")),
		prop: "itemName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.item.fields.configCode")),
		prop: "itemCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.sortOrder")),
		prop: "sortOrder",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			step: 1,
		},
	},
	{
		label: transformI18n($t("devTeam.menuManage.item.fields.isCached")),
		prop: "isDefault",
		valueType: "select",
		options: booleanOptions.value,
		required: true,
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	dictionaryId: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.selectDictionaryType")),
			trigger: "blur",
		},
	],
	itemName: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.item.form.validation.enterConfigItemName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.configManage.item.form.validation.configItemNameLength")),
			trigger: "blur",
		},
	],
	itemCode: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.item.form.validation.enterConfigItemCode")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.configManage.item.form.validation.configItemCodeLength")),
			trigger: "blur",
		},
		{
			pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
			message: transformI18n($t("devTeam.configManage.item.form.validation.configItemCodePattern")),
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
