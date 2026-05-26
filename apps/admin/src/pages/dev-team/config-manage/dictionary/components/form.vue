<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { dictionaryTypeOptions } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { DictionaryFormProps, type DictionaryFormData } from "./form";

const props = defineProps<DictionaryFormProps>();

/** 字典类型选项的 i18n key 映射，option.value 保持接口枚举值不变。 */
const dictionaryTypeLabelKeyMap = {
	system: "devTeam.configManage.dictionary.form.options.system",
	business: "devTeam.configManage.dictionary.form.options.business",
	region: "devTeam.configManage.dictionary.form.options.region",
	status: "devTeam.configManage.dictionary.form.options.status",
	config: "devTeam.configManage.dictionary.form.options.config",
} as const;

const defaultValues = props.defaultValues as FieldValues & DictionaryFormData;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/** 克隆 props.form 后再交给 PlusForm，避免弹窗内编辑直接污染列表行对象。 */
const toRefForm = cloneDeep(props.form) as FieldValues & DictionaryFormData;
const form = ref(toRefForm);

/** 暴露给弹窗关闭前比较和提交 payload 读取，保持和 PlusForm 当前值同步。 */
const formComputed = computed(() => {
	return form.value;
});

/** 动态生成字典类型 label，避免把翻译后的中文写回 dictionaryType。 */
const translatedDictionaryTypeOptions = computed(() =>
	dictionaryTypeOptions.map((option) => ({
		...option,
		label: transformI18n($t(dictionaryTypeLabelKeyMap[String(option.value) as keyof typeof dictionaryTypeLabelKeyMap])),
	})),
);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryName")),
		prop: "dictionaryName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryCode")),
		prop: "dictionaryCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.dictionaryType")),
		prop: "dictionaryType",
		valueType: "select",
		options: translatedDictionaryTypeOptions.value,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.dictionary.fields.description")),
		prop: "dictionaryDescription",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.center.fields.remark")),
		prop: "remark",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	dictionaryName: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.enterDictionaryName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.dictionaryNameLength")),
			trigger: "blur",
		},
	],
	dictionaryCode: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.enterDictionaryCode")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.dictionaryCodeLength")),
			trigger: "blur",
		},
		{
			pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.dictionaryCodePattern")),
			trigger: "blur",
		},
	],
	dictionaryType: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.dictionary.form.validation.selectDictionaryType")),
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
