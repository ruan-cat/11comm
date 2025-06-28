<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { OwnerInformationFormProps, 业主信息表单_VO, defaultForm } from "./form";

const props = defineProps<OwnerInformationFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 业主信息表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 业主信息表单_VO;

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
	// 人员类型
	{
		label: "人员类型",
		prop: "人员类型",
		valueType: "select",
		options: [
			{ label: "个人", value: "个人" },
			{ label: "企业", value: "企业" },
		],
		required: true,
	},

	// 人员角色
	{
		label: "人员角色",
		prop: "人员角色",
		valueType: "select",
		options: [
			{ label: "业主", value: "业主" },
			{ label: "租客", value: "租客" },
		],
		required: true,
	},

	// 客户名称
	{
		label: "客户名称",
		prop: "客户名称",
		valueType: "input",
		required: true,
	},

	// 联系手机
	{
		label: "联系手机",
		prop: "联系手机",
		valueType: "input",
		required: true,
	},

	// 性别
	{
		label: "性别",
		prop: "性别",
		valueType: "select",
		options: [
			{ label: "男", value: "男" },
			{ label: "女", value: "女" },
		],
		required: true,
	},

	// 备用手机
	{
		label: "备用手机",
		prop: "备用手机",
		valueType: "input",
	},

	// 地址
	{
		label: "地址",
		prop: "地址",
		valueType: "input",
	},

	// 门禁钥匙
	{
		label: "门禁钥匙",
		prop: "门禁钥匙",
		valueType: "input",
	},

	// 身份证
	{
		label: "身份证",
		prop: "身份证",
		valueType: "input",
	},

	// 备注
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验 */
const plusFormRules = {};

defineExpose({
	plusFormInstance,
	formComputed,
});
</script>

<template>
	<PlusForm
		ref="plusFormRef"
		v-model="form"
		class="form-root"
		:has-footer="false"
		:default-values="defaultValues"
		:columns="plusFormColumnsComputed"
		:rules="plusFormRules"
		:row-props="{ gutter: 20 }"
		:col-props="{
			span: 12,
		}"
		:label-width="100"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
