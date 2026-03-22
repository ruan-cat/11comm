<!--
  巡检项目表单
  用于新增 修改巡检项目
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import { PatrolItemFormProps } from "./form";
import type { PatrolItemFormVO } from "@01s-11comm/type";

const props = defineProps<PatrolItemFormProps>();
const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PatrolItemFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & PatrolItemFormVO);
const formComputed = computed(() => form.value);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_patrol-manage.item.form.code")),
		prop: "code",
		valueType: "input",
		required: true,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.item.form.patrolItem")),
		prop: "patrolItem",
		valueType: "input",
		required: true,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.item.form.createTime")),
		prop: "createTime",
		valueType: "date-picker",
		required: true,
	},
	{
		label: transformI18n($t("property-manage_patrol-manage.item.form.remark")),
		prop: "remark",
		valueType: "input",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	code: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.item.form.rules.codeRequired")),
			trigger: "blur",
		},
	],
	patrolItem: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.item.form.rules.patrolItemRequired")),
			trigger: "blur",
		},
	],
	createTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_patrol-manage.item.form.rules.createTimeRequired")),
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
