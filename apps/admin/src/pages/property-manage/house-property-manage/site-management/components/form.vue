<!--
  场地管理表单
  用于新增 修改场地管理
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { SiteManagementFormProps, SiteManagementFormVO, siteManagementStatusOptions } from "./form";

const props = defineProps<SiteManagementFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & SiteManagementFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & SiteManagementFormVO;

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
	// 编号
	{
		label: "编号",
		prop: "idNumber",
		valueType: "input",
		required: true,
	},

	// 名称
	{
		label: "名称",
		prop: "name",
		valueType: "input",
		required: true,
	},

	// 开场时间
	{
		label: "开场时间",
		prop: "openingTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
		required: true,
	},

	// 关场时间
	{
		label: "关场时间",
		prop: "closingTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
		required: true,
	},

	// 每小时费用
	{
		label: "每小时费用",
		prop: "hourlyFee",
		valueType: "input",
		required: true,
	},

	// 管理员
	{
		label: "管理员",
		prop: "administrator",
		valueType: "input",
		required: true,
	},

	// 管理员电话
	{
		label: "管理员电话",
		prop: "administratorPhone",
		valueType: "input",
		required: true,
	},

	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: siteManagementStatusOptions,
		required: true,
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	idNumber: [
		{
			required: true,
			message: "请输入编号",
			trigger: "blur",
		},
	],
	name: [
		{
			required: true,
			message: "请输入名称",
			trigger: "blur",
		},
	],
	openingTime: [
		{
			required: true,
			message: "请选择开场时间",
			trigger: "change",
		},
	],
	closingTime: [
		{
			required: true,
			message: "请选择关场时间",
			trigger: "change",
		},
	],
	hourlyFee: [
		{
			required: true,
			message: "请输入每小时费用",
			trigger: "blur",
		},
	],
	administrator: [
		{
			required: true,
			message: "请输入管理员",
			trigger: "blur",
		},
	],
	administratorPhone: [
		{
			required: true,
			message: "请输入管理员电话",
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号格式",
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: "请选择状态",
			trigger: "change",
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
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
