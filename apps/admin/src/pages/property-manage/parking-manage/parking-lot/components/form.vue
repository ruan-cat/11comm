<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { ParkingLotFormVO } from "@01s-11comm/type";
import { parkingLotTypeOptions, parkingSpaceTypeOptions } from "@01s-11comm/type";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { ParkingLotFormProps } from "./form";

const props = defineProps<ParkingLotFormProps>();

const { locale, withLocale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ParkingLotFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & ParkingLotFormVO);
/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

const translatedParkingLotTypeOptions = withLocale(() =>
	parkingLotTypeOptions.map((option) => ({
		...option,
		label: transformI18n($t(`property-manage_parking-manage.parking-lot.form.options.parkingLotType.${option.value}`)),
	})),
);

const translatedParkingSpaceTypeOptions = withLocale(() =>
	parkingSpaceTypeOptions.map((option) => ({
		...option,
		label: transformI18n(
			$t(`property-manage_parking-manage.parking-lot.form.options.parkingSpaceType.${option.value}`),
		),
	})),
);

/** 表单项配置 */
const plusFormColumns = withLocale<PlusColumn[]>(() => [
	// 停车场编号
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.form.fields.parkingLotNumber")),
		prop: "parkingLotNumber",
		valueType: "input",
		required: true,
	},
	// 停车场类型
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.form.fields.parkingLotType")),
		prop: "parkingLotType",
		valueType: "select",
		required: true,
		options: translatedParkingLotTypeOptions.value,
	},
	// 车位类型
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.form.fields.parkingSpaceType")),
		prop: "parkingSpaceType",
		valueType: "select",
		required: true,
		options: translatedParkingSpaceTypeOptions.value,
	},
	// 外部编码
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.form.fields.externalCode")),
		prop: "externalCode",
		valueType: "input",
		required: true,
	},
	// 备注
	{
		label: transformI18n($t("property-manage_parking-manage.parking-lot.form.fields.remark")),
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = withLocale<PlusFormRules>(() => ({
	parkingLotNumber: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.parking-lot.form.validation.parkingLotNumber")),
			trigger: "blur",
		},
	],
	parkingLotType: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.parking-lot.form.validation.parkingLotType")),
			trigger: "change",
		},
	],
	parkingSpaceType: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.parking-lot.form.validation.parkingSpaceType")),
			trigger: "change",
		},
	],
	externalCode: [
		{
			required: true,
			message: transformI18n($t("property-manage_parking-manage.parking-lot.form.validation.externalCode")),
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
