<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { CancelFeeFormVO } from "@01s-11comm/type";
import { auditStatusOptions } from "@01s-11comm/type";

import { CancelFeeFormProps, defaultForm } from "./form";

const props = defineProps<CancelFeeFormProps>();
const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & CancelFeeFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(cloneDeep(props.form) as FieldValues & CancelFeeFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.cancel-fee.form.fields.batchNumber")),
		prop: "batchNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.cancel-fee.form.fields.employee")),
		prop: "employee",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.cancel-fee.form.fields.time")),
		prop: "time",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_expense-manage.cancel-fee.form.fields.cancelReason")),
		prop: "cancelReason",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.cancel-fee.form.fields.auditStatus")),
		prop: "auditStatus",
		valueType: "select",
		options: auditStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_expense-manage.cancel-fee.form.fields.auditOpinion")),
		prop: "auditOpinion",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	auditStatus: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.cancel-fee.form.validation.auditStatusRequired")),
			trigger: "change",
		},
	],
	auditOpinion: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.cancel-fee.form.validation.auditOpinionRequired")),
			trigger: "blur",
		},
	],
}));

// 暴露给父组件使用的变量和方法
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
