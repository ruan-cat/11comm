<!--
  场地预约订单表单
  用于新增 修改场地预约订单
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import type { ReserveVenueOrderFormVO } from "@01s-11comm/type";
import { reservedVenueOptions, reserveVenueOrderStatusOptions } from "@01s-11comm/type";
import type { ReserveVenueOrderFormProps } from "./form";

const props = defineProps<ReserveVenueOrderFormProps>();

const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ReserveVenueOrderFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & ReserveVenueOrderFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 订单编号
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.orderNumber")),
		prop: "orderNumber",
		valueType: "input",
		required: true,
	},

	// 场馆
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.venue")),
		prop: "venue",
		valueType: "input",
		required: true,
	},

	// 场地
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.site")),
		prop: "site",
		valueType: "select",
		options: reservedVenueOptions,
		required: true,
	},

	// 预约人
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.reserver")),
		prop: "reserver",
		valueType: "input",
		required: true,
	},

	// 预约电话
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.reservationPhone")),
		prop: "reservationPhone",
		valueType: "input",
		required: true,
	},

	// 预约日期
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.reservationDate")),
		prop: "reservationDate",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
		required: true,
	},

	// 预约时间
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.reservationTime")),
		prop: "reservationTime",
		valueType: "input",
		required: true,
	},

	// 应收金额
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.receivableAmount")),
		prop: "receivableAmount",
		valueType: "input",
		required: true,
	},

	// 实收金额
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.receivedAmount")),
		prop: "receivedAmount",
		valueType: "input",
		required: true,
	},

	// 支付方式
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.paymentMethod")),
		prop: "paymentMethod",
		valueType: "select",
		options: [
			{ label: "微信", value: "微信" },
			{ label: "支付宝", value: "支付宝" },
			{ label: "现金", value: "现金" },
			{ label: "银行卡", value: "银行卡" },
		],
		required: true,
	},

	// 状态
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.status")),
		prop: "status",
		valueType: "select",
		options: reserveVenueOrderStatusOptions,
		required: true,
	},

	// 创建时间
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.createTime")),
		prop: "createTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},

	// 备注
	{
		label: transformI18n($t("property-manage_house-property-manage.reserve-venue-order.form.fields.remark")),
		prop: "remark",
		valueType: "input",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	orderNumber: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.orderNumberRequired"),
			),
			trigger: "blur",
		},
	],
	venue: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.venueRequired"),
			),
			trigger: "blur",
		},
	],
	site: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.siteRequired"),
			),
			trigger: "change",
		},
	],
	reserver: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.reserverRequired"),
			),
			trigger: "blur",
		},
	],
	reservationPhone: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.reservationPhoneRequired"),
			),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.reservationPhoneFormat"),
			),
			trigger: "blur",
		},
	],
	reservationDate: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.reservationDateRequired"),
			),
			trigger: "change",
		},
	],
	reservationTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.reservationTimeRequired"),
			),
			trigger: "blur",
		},
	],
	receivableAmount: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.receivableAmountRequired"),
			),
			trigger: "blur",
		},
	],
	receivedAmount: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.receivedAmountRequired"),
			),
			trigger: "blur",
		},
	],
	paymentMethod: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.paymentMethodRequired"),
			),
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.statusRequired"),
			),
			trigger: "change",
		},
	],
	createTime: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.reserve-venue-order.form.validation.createTimeRequired"),
			),
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
