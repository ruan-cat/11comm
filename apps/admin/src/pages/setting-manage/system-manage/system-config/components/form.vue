<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type SystemConfigFormProps, defaultForm } from "./form";
import type { SystemConfigListItem } from "@01s-11comm/type";
import { cloneDeep } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";

const props = defineProps<SystemConfigFormProps>();
const { computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & SystemConfigListItem;

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
const toRefForm = cloneDeep(props.form) as FieldValues & SystemConfigListItem;

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

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.title")),
		prop: "title",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.subtitle")),
		prop: "subtitle",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.shortName")),
		prop: "shortName",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.companyName")),
		prop: "companyName",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.logoUrl")),
		prop: "logoUrl",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.staticUrl")),
		prop: "staticUrl",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.defaultCommunityCode")),
		prop: "defaultCommunityCode",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.ownerTitle")),
		prop: "ownerTitle",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.propertyMobileTitle")),
		prop: "propertyMobileTitle",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.qqMapKey")),
		prop: "qqMapKey",
		valueType: "input",
	},
	{
		label: transformI18n($t("settingManage.systemManage.systemConfig.fields.mallUrl")),
		prop: "mallUrl",
		valueType: "input",
	},
]);

/** 表单项配置 动态计算 只读 */

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({}));

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
			label-width="120px"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
