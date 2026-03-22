<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import type { HouseManagementFormVO } from "@01s-11comm/type";
import { houseTypeOptions, houseStatusOptions } from "@01s-11comm/type";
import type { HouseManageFormProps } from "./form";
import type { FieldValues } from "plus-pro-components";

const props = defineProps<HouseManageFormProps>();

const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & HouseManagementFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & HouseManagementFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_house-property-manage.house.form.fields.house")),
		prop: "house",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.form.fields.floor")),
		prop: "floor",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.form.fields.owner")),
		prop: "owner",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.form.fields.type")),
		prop: "type",
		valueType: "select",
		options: houseTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.form.fields.houseArea")),
		prop: "houseArea",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.form.fields.rent")),
		prop: "rent",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.form.fields.houseStatus")),
		prop: "houseStatus",
		valueType: "select",
		options: houseStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_house-property-manage.house.form.fields.validUntil")),
		prop: "validUntil",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	house: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.house.form.validation.houseRequired")),
			trigger: "blur",
		},
	],
	floor: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.house.form.validation.floorRequired")),
			trigger: "blur",
		},
	],
	owner: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.house.form.validation.ownerRequired")),
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.house.form.validation.typeRequired")),
			trigger: "change",
		},
	],
	houseArea: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.house.form.validation.houseAreaRequired")),
			trigger: "blur",
		},
	],
	rent: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.house.form.validation.rentRequired")),
			trigger: "blur",
		},
	],
	houseStatus: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.house.form.validation.houseStatusRequired")),
			trigger: "change",
		},
	],
	validUntil: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.house.form.validation.validUntilRequired")),
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
