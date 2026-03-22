<script lang="ts" setup>
import { useTemplateRef, ref, computed } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { MeterReadingTypeFormVO } from "@01s-11comm/type";

import { MeterTypeFormProps } from "./form";

const props = defineProps<MeterTypeFormProps>();
const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & MeterReadingTypeFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & MeterReadingTypeFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_expense-manage.meter-reading-type.form.fields.name")),
		prop: "name",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.meter-reading-type.form.placeholders.name")),
		},
	},
	{
		label: transformI18n($t("property-manage_expense-manage.meter-reading-type.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: transformI18n($t("property-manage_expense-manage.meter-reading-type.form.placeholders.description")),
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n($t("property-manage_expense-manage.meter-reading-type.form.validation.nameRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_expense-manage.meter-reading-type.form.validation.nameLength")),
			trigger: "blur",
		},
	],
	description: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_expense-manage.meter-reading-type.form.validation.descriptionRequired"),
			),
			trigger: "blur",
		},
		{
			min: 5,
			max: 200,
			message: transformI18n($t("property-manage_expense-manage.meter-reading-type.form.validation.descriptionLength")),
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
