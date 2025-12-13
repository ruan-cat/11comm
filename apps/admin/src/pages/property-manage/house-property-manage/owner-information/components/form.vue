<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { OwnerInformationFormProps, defaultForm } from "./form";

const props = defineProps<OwnerInformationFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OwnerInformationFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & OwnerInformationFormVO;

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
		options: 人员类型Options,
		required: true,
	},

	// 人员角色
	{
		label: "人员角色",
		prop: "人员角色",
		valueType: "select",
		options: 人员角色Options,
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
		options: 性别Options,
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

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	人员类型: [
		{
			required: true,
			message: "请选择人员类型",
			trigger: "change",
		},
	],
	人员角色: [
		{
			required: true,
			message: "请选择人员角色",
			trigger: "change",
		},
	],
	客户名称: [
		{
			required: true,
			message: "请输入客户名称",
			trigger: "blur",
		},
	],
	联系手机: [
		{
			required: true,
			message: "请输入联系手机",
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号格式",
			trigger: "blur",
		},
	],
	性别: [
		{
			required: true,
			message: "请选择性别",
			trigger: "change",
		},
	],
	身份证: [
		{
			required: true,
			message: "请输入身份证",
			trigger: "blur",
		},
	],
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
			:row-props="{ gutter: 20 }"
			:col-props="{
				span: 12,
			}"
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
