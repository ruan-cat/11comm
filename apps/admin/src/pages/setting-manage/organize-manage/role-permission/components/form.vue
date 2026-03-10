<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useTemplateRef } from "vue";
import type { PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

import { RolePermissionFormProps } from "./form";
import type { RolePermissionFormVO } from "@01s-11comm/type";

/** 表单组件 props */
const props = defineProps<RolePermissionFormProps>();
const { t } = useI18n();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & RolePermissionFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & RolePermissionFormVO;

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

const translatedStatusOptions = computed(() => [
	{ label: transformI18n(t("settingManage.organizeManage.rolePermission.status.enabled")), value: true },
	{ label: transformI18n(t("settingManage.organizeManage.rolePermission.status.disabled")), value: false },
]);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n(t("settingManage.organizeManage.rolePermission.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			readonly: false,
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.rolePermission.fields.code")),
		prop: "code",
		valueType: "input",
		fieldProps: {
			readonly: false,
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.rolePermission.fields.status")),
		prop: "enabled",
		valueType: "select",
		options: translatedStatusOptions.value,
		fieldProps: {
			readonly: false,
		},
	},
	{
		label: transformI18n(t("settingManage.organizeManage.rolePermission.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			readonly: false,
			rows: 4,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.rolePermission.form.validation.enterName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n(t("settingManage.organizeManage.rolePermission.form.validation.nameLength")),
			trigger: "blur",
		},
	],
	code: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.rolePermission.form.validation.enterCode")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Z][A-Z0-9_]*$/,
			message: transformI18n(t("settingManage.organizeManage.rolePermission.form.validation.codePattern")),
			trigger: "blur",
		},
	],
	enabled: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.rolePermission.form.validation.selectStatus")),
			trigger: "change",
		},
	],
	description: [
		{
			max: 200,
			message: transformI18n(t("settingManage.organizeManage.rolePermission.form.validation.descriptionMax")),
			trigger: "blur",
		},
	],
}));

// 默认导出表单实例和表单对象，供外部使用
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
