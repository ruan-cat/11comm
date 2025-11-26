<!--
  我的小区管理表单
  用于新增 修改小区信息
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { CommunityManageMyFormProps, CommunityManageMyFormVO, provinceOptions, communityStatusOptions } from "./form";

const props = defineProps<CommunityManageMyFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & CommunityManageMyFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & CommunityManageMyFormVO;

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
		label: "小区名称",
		prop: "name",
		valueType: "input",
		width: "240px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入小区名称",
		},
	},
	{
		label: "小区编码",
		prop: "code",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入小区编码",
		},
	},
	{
		label: "省份",
		prop: "province",
		valueType: "select",
		width: "180px",
		options: provinceOptions,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择省份",
		},
	},
	{
		label: "城市",
		prop: "city",
		valueType: "input",
		width: "180px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入城市名称",
		},
	},
	{
		label: "区县",
		prop: "district",
		valueType: "input",
		width: "180px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入区县名称",
		},
	},
	{
		label: "客服电话",
		prop: "servicePhone",
		valueType: "input",
		width: "200px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入客服电话",
		},
	},
	{
		label: "面积",
		prop: "area",
		valueType: "input",
		width: "180px",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入小区面积，如：15.6万㎡",
		},
	},
	{
		label: "开始时间",
		prop: "startTime",
		valueType: "date-picker",
		width: "200px",
		required: true,
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			"value-format": "YYYY-MM-DD",
			clearable: true,
			placeholder: "请选择开始时间",
		},
	},
	{
		label: "结束时间",
		prop: "endTime",
		valueType: "date-picker",
		width: "200px",
		required: true,
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			"value-format": "YYYY-MM-DD",
			clearable: true,
			placeholder: "请选择结束时间",
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		width: "160px",
		options: communityStatusOptions,
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请选择小区状态",
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	name: [
		{ required: true, message: "请输入小区名称", trigger: "blur" },
		{ min: 2, max: 50, message: "小区名称长度应在 2 到 50 个字符之间", trigger: "blur" },
	],
	code: [
		{ required: true, message: "请输入小区编码", trigger: "blur" },
		{ pattern: /^SQ\d{6}$/, message: "小区编码格式应为 SQ + 6 个数字，如：SQ000001", trigger: "blur" },
	],
	province: [{ required: true, message: "请选择省份", trigger: "change" }],
	city: [
		{ required: true, message: "请输入城市名称", trigger: "blur" },
		{ min: 2, max: 20, message: "城市名称长度应在 2 到 20 个字符之间", trigger: "blur" },
	],
	district: [
		{ required: true, message: "请输入区县名称", trigger: "blur" },
		{ min: 2, max: 20, message: "区县名称长度应在 2 到 20 个字符之间", trigger: "blur" },
	],
	servicePhone: [
		{ required: true, message: "请输入客服电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	area: [
		{ required: true, message: "请输入小区面积", trigger: "blur" },
		{ pattern: /^\d+(\.\d+)?万㎡$/, message: "面积格式应为数字+万㎡，如：15.6万㎡", trigger: "blur" },
	],
	startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	endTime: [
		{ required: true, message: "请选择结束时间", trigger: "change" },
		{
			validator: (rule: any, value: string, callback: Function) => {
				if (value && form.value.startTime && new Date(value) <= new Date(form.value.startTime)) {
					callback(new Error("结束时间必须晚于开始时间"));
				} else {
					callback();
				}
			},
			trigger: "change",
		},
	],
	status: [{ required: true, message: "请选择小区状态", trigger: "change" }],
});

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
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
