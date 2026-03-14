<!--
  业主车辆表单
  用于新增和修改业主车辆
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { OwnerVehicleFormVO } from "@01s-11comm/type";
import { vehicleTypeOptions, licensePlateTypeOptions } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { OwnerVehicleFormProps } from "./form";

const props = defineProps<OwnerVehicleFormProps>();

const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OwnerVehicleFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & OwnerVehicleFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedVehicleTypeOptions = withLocale(() =>
	vehicleTypeOptions.map((option) => ({
		...option,
		label: transformI18n($t(`property-manage_parking-manage.owner-vehicle.form.options.vehicleType.${option.value}`)),
	})),
);

const translatedLicensePlateTypeOptions = withLocale(() =>
	licensePlateTypeOptions.map((option) => ({
		...option,
		label: transformI18n(
			$t(`property-manage_parking-manage.owner-vehicle.form.options.licensePlateType.${option.value}`),
		),
	})),
);

const translatedOwnerVehicleOptions = withLocale(() => [
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.options.ownerVehicle.yes")),
		value: "是",
	},
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.options.ownerVehicle.no")),
		value: "否",
	},
]);

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	// 车牌号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.licensePlate")),
		prop: "licensePlate",
		valueType: "input",
		required: true,
	},
	// 汽车品牌
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.carBrand")),
		prop: "carBrand",
		valueType: "input",
	},
	// 车类型
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.carType")),
		prop: "carType",
		valueType: "select",
		options: translatedVehicleTypeOptions.value,
		required: true,
	},
	// 颜色
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.color")),
		prop: "color",
		valueType: "input",
	},
	// 车牌类型
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.licensePlateType")),
		prop: "licensePlateType",
		valueType: "select",
		options: translatedLicensePlateTypeOptions.value,
		required: true,
	},
	// 业主
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.owner")),
		prop: "owner",
		valueType: "input",
		required: true,
		disabled: true,
	},
	// 车位
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.parkingSpace")),
		prop: "parkingSpace",
		valueType: "input",
		required: true,
		disabled: true,
	},
	// 业主车辆
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.ownerVehicle")),
		prop: "ownerVehicle",
		valueType: "select",
		options: translatedOwnerVehicleOptions.value,
		required: true,
	},
	// 开始时间
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		required: true,
	},
	// 结束时间
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		required: true,
	},
	// 备注
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.fields.remark")),
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	licensePlate: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.validation.licensePlate")),
			trigger: "blur",
		},
	],
	carType: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.validation.carType")),
			trigger: "change",
		},
	],
	licensePlateType: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.validation.licensePlateType")),
			trigger: "change",
		},
	],
	owner: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.validation.owner")),
			trigger: "blur",
		},
	],
	parkingSpace: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.validation.parkingSpace")),
			trigger: "blur",
		},
	],
	ownerVehicle: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.validation.ownerVehicle")),
			trigger: "change",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.validation.startTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.owner-vehicle.form.validation.endTime")),
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
			:label-width="100"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
