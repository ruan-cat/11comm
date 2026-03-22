<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";
import type { ContractTypeFormVO } from "@01s-11comm/type";
import { auditTypeOptions } from "@01s-11comm/type";

import { AddFormProps, defaultForm } from "./form";

const props = defineProps<AddFormProps>();
const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ContractTypeFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & ContractTypeFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const auditLabelMap = {
	yes: "property-manage_contract-manage.contract-type.options.auditYes",
	no: "property-manage_contract-manage.contract-type.options.auditNo",
} as const;

function translateAuditLabel(value?: string | null) {
	if (!value) return value ?? "";
	const key = auditLabelMap[value as keyof typeof auditLabelMap];
	return key ? transformI18n($t(key)) : value;
}

const translatedAuditTypeOptions = computed(() =>
	auditTypeOptions.map((option) => ({
		...option,
		label: translateAuditLabel(String(option.value)),
	})),
);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	/** 类型名称 */
	{
		label: transformI18n($t("property-manage_contract-manage.contract-type.form.fields.typeName")),
		prop: "typeName",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-type.form.placeholders.typeName")),
		},
	},

	/** 是否审核 */
	{
		label: transformI18n($t("property-manage_contract-manage.contract-type.form.fields.isAudit")),
		prop: "isAudit",
		valueType: "select",
		options: translatedAuditTypeOptions.value,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	/** 描述 */
	{
		label: transformI18n($t("property-manage_contract-manage.contract-type.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-type.form.placeholders.description")),
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	typeName: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-type.form.validation.typeNameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_contract-manage.contract-type.form.validation.typeNameLength")),
			trigger: "blur",
		},
	],
	isAudit: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-type.form.validation.isAuditRequired")),
			trigger: "change",
		},
	],
	description: [
		{
			max: 500,
			message: transformI18n($t("property-manage_contract-manage.contract-type.form.validation.descriptionLength")),
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
