<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { OwnersCommitteeProps, 业委会表单_VO, defaultForm } from "./form";
import { useDisabled, useFormDisabled } from "element-plus";

const props = defineProps<OwnersCommitteeProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 业委会表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 业委会表单_VO;

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
	// 姓名
	{
		label: "姓名",
		prop: "姓名",
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

	// 电话
	{
		label: "电话",
		prop: "电话",
		valueType: "input",
		required: true,
	},

	// 身份证号码
	{
		label: "身份证号码",
		prop: "身份证号码",
		valueType: "input",
		required: true,
	},
	// 住址
	{
		label: "住址",
		prop: "住址",
		valueType: "input",
		required: true,
	},
	// 职位
	{
		label: "职位",
		prop: "职位",
		valueType: "input",
		required: true,
	},
	// 岗位
	{
		label: "岗位",
		prop: "岗位",
		valueType: "input",
		required: true,
	},
	// 岗位描述
	{
		label: "岗位描述",
		prop: "岗位描述",
		valueType: "input",
	},
	// 届期
	{
		label: "届期",
		prop: "届期",
		valueType: "input",
		required: true,
	},
	// 任期
	{
		label: "任期",
		prop: "任期",
		valueType: "input",
		required: true,
	},
	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: [
			{ label: "在职", value: "在职" },
			{ label: "离职", value: "离职" },
		],
		required: true,
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
	<!-- 需要配置分组表单，一旦配置分组表单，columns将会失效
    1.配置两列：
      :row-props="{ gutter: 20 }"
      :col-props="{
        span: 12, //24/12=2列
      }"
    2.为了“身份证号码”label好看点，配置label宽度：
      :label-width="100"
  -->
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
			span: 12, //24/12=2列
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
