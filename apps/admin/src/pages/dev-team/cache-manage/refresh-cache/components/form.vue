<!--
  刷新缓存表单
  用于新增、修改刷新缓存配置
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import type { RefreshCacheFormVO } from "@01s-11comm/type";
import { cacheTypeOptions, refreshPolicyOptions, cacheStatusOptions } from "@01s-11comm/type";

import { RefreshCacheFormProps, defaultForm } from "./form";

const props = defineProps<RefreshCacheFormProps>();
const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & RefreshCacheFormVO;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = cloneDeep(props.form) as FieldValues & RefreshCacheFormVO;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 Form columns configuration */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheCode")),
		prop: "cacheCode",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.cacheManage.refreshCache.form.placeholders.cacheCode")),
		},
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheName")),
		prop: "cacheName",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.cacheManage.refreshCache.form.placeholders.cacheName")),
		},
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheKey")),
		prop: "cacheKey",
		valueType: "input",
		required: true,
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.cacheManage.refreshCache.form.placeholders.cacheKey")),
		},
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheType")),
		prop: "cacheType",
		valueType: "select",
		required: true,
		width: "160px",
		options: cacheTypeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("devTeam.cacheManage.refreshCache.form.placeholders.cacheType")),
		},
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.cacheGroup")),
		prop: "cacheGroup",
		valueType: "input",
		required: true,
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.cacheManage.refreshCache.form.placeholders.cacheGroup")),
		},
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.expireTimeSeconds")),
		prop: "expireTime",
		valueType: "input-number",
		required: true,
		width: "160px",
		fieldProps: {
			min: 1,
			max: 86400 * 30,
			controlsPosition: "right",
			placeholder: transformI18n($t("devTeam.cacheManage.refreshCache.form.placeholders.expireTime")),
		},
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.description")),
		prop: "description",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.cacheManage.refreshCache.form.placeholders.description")),
			rows: 3,
			maxlength: 200,
			showWordLimit: true,
		},
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.refreshPolicy")),
		prop: "refreshPolicy",
		valueType: "select",
		required: true,
		width: "160px",
		options: refreshPolicyOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: transformI18n($t("devTeam.cacheManage.refreshCache.form.placeholders.refreshPolicy")),
		},
	},
	{
		label: transformI18n($t("devTeam.cacheManage.refreshCache.fields.status")),
		prop: "status",
		valueType: "select",
		required: true,
		width: "120px",
		options: cacheStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("devTeam.cacheManage.refreshCache.form.placeholders.status")),
		},
	},
]);

/** 表单校验规则 Form validation rules */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	cacheCode: [
		{
			required: true,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.enterCacheCode")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.cacheCodeLength")),
			trigger: "blur",
		},
		{
			pattern: /^[A-Z0-9_]+$/,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.cacheCodePattern")),
			trigger: "blur",
		},
	],
	cacheName: [
		{
			required: true,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.enterCacheName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.cacheNameLength")),
			trigger: "blur",
		},
	],
	cacheKey: [
		{
			required: true,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.enterCacheKey")),
			trigger: "blur",
		},
		{
			min: 3,
			max: 100,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.cacheKeyLength")),
			trigger: "blur",
		},
		{
			pattern: /^[a-zA-Z0-9_:{}[\].-]+$/,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.cacheKeyPattern")),
			trigger: "blur",
		},
	],
	cacheType: [
		{
			required: true,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.selectCacheType")),
			trigger: "change",
		},
	],
	cacheGroup: [
		{
			required: true,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.enterCacheGroup")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 30,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.cacheGroupLength")),
			trigger: "blur",
		},
	],
	expireTime: [
		{
			required: true,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.enterExpireTime")),
			trigger: "blur",
		},
		{
			type: "number",
			min: 1,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.expireTimeMin")),
			trigger: "blur",
		},
	],
	refreshPolicy: [
		{
			required: true,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.selectRefreshPolicy")),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("devTeam.cacheManage.refreshCache.form.validation.selectStatus")),
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
