<!--
  商户信息表单
  用于新增 修改商户信息
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { MerchantInfoFormVO } from "@01s-11comm/type";
import { merchantTypeOptions, businessStatusOptions } from "@01s-11comm/type";
import type { PlusColumn } from "plus-pro-components";

import { MerchantInfoFormProps } from "./form";

const props = defineProps<MerchantInfoFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & MerchantInfoFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & MerchantInfoFormVO;

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
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "商户编号",
		prop: "merchantId",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入商户编号",
			disabled: true,
		},
	},
	{
		label: "商户名称",
		prop: "merchantName",
		valueType: "input",
		width: "240px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入商户名称",
		},
	},
	{
		label: "商户类型",
		prop: "merchantType",
		valueType: "select",
		width: "160px",
		options: merchantTypeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择商户类型",
		},
	},
	{
		label: "经营状态",
		prop: "businessStatus",
		valueType: "select",
		width: "140px",
		options: businessStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择经营状态",
		},
	},
	{
		label: "商户地址",
		prop: "merchantAddress",
		valueType: "input",
		width: "320px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入商户详细地址",
		},
	},
	{
		label: "所属小区",
		prop: "affiliatedCommunity",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入所属小区/写字楼",
		},
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入联系电话",
		},
	},
	{
		label: "联系人手机",
		prop: "contactMobile",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入联系人手机号",
		},
	},
	{
		label: "企业法人",
		prop: "legalRepresentative",
		valueType: "input",
		width: "160px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入企业法人姓名",
		},
	},
	{
		label: "成立日期",
		prop: "establishmentDate",
		valueType: "date-picker",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请选择成立日期",
			type: "date",
			format: "YYYY-MM-DD",
			valueFormat: "YYYY-MM-DD",
		},
	},
	{
		label: "营业时间",
		prop: "businessHours",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入每日营业时间段",
		},
	},
	{
		label: "经营面积",
		prop: "businessArea",
		valueType: "input-number",
		width: "160px",
		fieldProps: {
			min: 0,
			max: 999999,
			precision: 2,
			placeholder: "请输入经营面积",
		},
	},
	{
		label: "营业执照号",
		prop: "businessLicenseNo",
		valueType: "input",
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入营业执照号",
		},
	},
	{
		label: "开户银行",
		prop: "bankName",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入开户银行",
		},
	},
	{
		label: "银行账号",
		prop: "bankAccount",
		valueType: "input",
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入银行账号",
		},
	},
	{
		label: "备注",
		prop: "remarks",
		valueType: "textarea",
		width: "100%",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
			rows: 3,
			maxlength: 500,
			showWordLimit: true,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	merchantName: [
		{ required: true, message: "请输入商户名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	merchantType: [{ required: true, message: "请选择商户类型", trigger: "change" }],
	businessStatus: [{ required: true, message: "请选择经营状态", trigger: "change" }],
	merchantAddress: [
		{ required: true, message: "请输入商户地址", trigger: "blur" },
		{ min: 5, max: 200, message: "长度在 5 到 200 个字符", trigger: "blur" },
	],
	affiliatedCommunity: [
		{ required: true, message: "请输入所属小区", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	contactPhone: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/, message: "请输入正确的电话号码", trigger: "blur" },
	],
	contactMobile: [
		{ required: true, message: "请输入联系人手机", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	legalRepresentative: [
		{ required: true, message: "请输入企业法人姓名", trigger: "blur" },
		{ min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
	],
	establishmentDate: [{ required: true, message: "请选择成立日期", trigger: "change" }],
	businessHours: [
		{
			pattern: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])-([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/,
			message: "请输入正确的时间格式，如：09:00-22:00",
			trigger: "blur",
		},
	],
	businessArea: [{ type: "number", min: 0, max: 999999, message: "经营面积范围 0-999999 平方米", trigger: "blur" }],
	businessLicenseNo: [
		{ required: true, message: "请输入营业执照号", trigger: "blur" },
		{ pattern: /^[0-9A-Z]{18}$/, message: "请输入正确的18位营业执照号", trigger: "blur" },
	],
	bankName: [{ max: 50, message: "开户银行长度不能超过 50 个字符", trigger: "blur" }],
	bankAccount: [{ max: 30, message: "银行账号长度不能超过 30 个字符", trigger: "blur" }],
	remarks: [{ max: 500, message: "备注长度不能超过 500 个字符", trigger: "blur" }],
});

/** 默认对外导出函数 */
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
			:columns="plusFormColumnsComputed"
			:rules="plusFormRules"
			:label-width="120"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
