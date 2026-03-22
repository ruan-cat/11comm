<!--
  场地预约表单
  用于新增 修改场地预约
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { ReserveVenueFormVO } from "@01s-11comm/type";
import { venueTypeOptions, reservationStatusOptions } from "@01s-11comm/type";
import type { ReserveVenueFormProps } from "./form";

const props = defineProps<ReserveVenueFormProps>();
const { locale } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & ReserveVenueFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const form = ref(cloneDeep(props.form) as FieldValues & ReserveVenueFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => form.value);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 预约人
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.reserver")),
		prop: "reserver",
		valueType: "input",
		required: true,
	},

	// 联系电话
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
		required: true,
	},

	// 预约时间
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.reservationTime")),
		prop: "reservationTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
		required: true,
	},

	// 开始时间
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.startTime")),
		prop: "startTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
		required: true,
	},

	// 结束时间
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.endTime")),
		prop: "endTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
		required: true,
	},

	// 场地类型
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.venueType")),
		prop: "venueType",
		valueType: "select",
		options: venueTypeOptions.map((item) => ({ label: item.label, value: item.value })),
		required: true,
	},

	// 预约状态
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.reservationStatus")),
		prop: "reservationStatus",
		valueType: "select",
		options: reservationStatusOptions.map((item) => ({ label: item.label, value: item.value })),
		required: true,
	},

	// 使用人数
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.numberOfUsers")),
		prop: "numberOfUsers",
		valueType: "input-number",
		required: true,
	},

	// 备注
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue.fields.remark")),
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	reserver: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.reserve-venue.form.validation.enterReserver")),
			trigger: "blur",
		},
	],
	contactPhone: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue.form.validation.enterContactPhone"),
			),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue.form.validation.contactPhonePattern"),
			),
			trigger: "blur",
		},
	],
	reservationTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue.form.validation.selectReservationTime"),
			),
			trigger: "change",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.reserve-venue.form.validation.selectStartTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.reserve-venue.form.validation.selectEndTime")),
			trigger: "change",
		},
	],
	venueType: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.reserve-venue.form.validation.selectVenueType")),
			trigger: "change",
		},
	],
	reservationStatus: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue.form.validation.selectReservationStatus"),
			),
			trigger: "change",
		},
	],
	numberOfUsers: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue.form.validation.enterNumberOfUsers"),
			),
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
