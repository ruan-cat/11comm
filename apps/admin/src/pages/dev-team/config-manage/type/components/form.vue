<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { type DictionaryTypeFormData, type DictionaryTypeFormProps } from "./form";

const props = defineProps<DictionaryTypeFormProps>();

const defaultValues = props.defaultValues as FieldValues & DictionaryTypeFormData;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/** 克隆 props.form 后再交给 PlusForm，避免弹窗内编辑直接污染列表行对象。 */
const form = ref(cloneDeep(props.form) as FieldValues & DictionaryTypeFormData);
/** 暴露给弹窗关闭前比较和提交 payload 读取，保持和 PlusForm 当前值同步。 */
const formComputed = computed(() => form.value);

const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.configManage.type.fields.typeName")),
		prop: "typeName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.typeCode")),
		prop: "typeCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
		required: true,
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.typeDescription")),
		prop: "typeDescription",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			rows: 3,
		},
	},
	{
		label: transformI18n($t("devTeam.configManage.type.fields.sortOrder")),
		prop: "sortOrder",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			step: 1,
		},
	},
]);

const plusFormRules = computed<PlusFormRules>(() => ({
	typeName: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.typeNameRequired")),
			trigger: "blur",
		},
	],
	typeCode: [
		{
			required: true,
			message: transformI18n($t("devTeam.configManage.type.form.validation.typeCodeRequired")),
			trigger: "blur",
		},
		{
			pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
			message: transformI18n($t("devTeam.configManage.type.form.validation.typeCodePattern")),
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
