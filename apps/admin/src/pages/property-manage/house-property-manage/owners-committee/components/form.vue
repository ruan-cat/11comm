<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { OwnersCommitteeFormProps, defaultForm } from "./form";
import type { OwnersCommitteeFormVO } from "@01s-11comm/type";
import { genderOptions, ownersCommitteeStatusOptions } from "@01s-11comm/type";

const props = defineProps<OwnersCommitteeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OwnersCommitteeFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & OwnersCommitteeFormVO;

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
		prop: "fullName",
		valueType: "input",
		required: true,
	},

	// 性别
	{
		label: "性别",
		prop: "gender",
		valueType: "select",
		options: genderOptions,
		required: true,
	},

	// 电话
	{
		label: "电话",
		prop: "phone",
		valueType: "input",
		required: true,
	},

	// 身份证号码
	{
		label: "身份证号码",
		prop: "idNumber",
		valueType: "input",
		required: true,
	},
	// 住址
	{
		label: "住址",
		prop: "address",
		valueType: "input",
		required: true,
	},
	// 职位
	{
		label: "职位",
		prop: "position",
		valueType: "input",
		required: true,
	},
	// 岗位
	{
		label: "岗位",
		prop: "post",
		valueType: "input",
		required: true,
	},
	// 岗位描述
	{
		label: "岗位描述",
		prop: "postDescription",
		valueType: "input",
	},
	// 届期
	{
		label: "届期",
		prop: "term",
		valueType: "input",
		required: true,
	},
	// 任期
	{
		label: "任期",
		prop: "tenure",
		valueType: "input",
		required: true,
	},
	// 状态
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: ownersCommitteeStatusOptions,
		required: true,
	},
	// 备注
	{
		label: "备注",
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	fullName: [
		{
			required: true,
			message: "请输入姓名",
			trigger: "blur",
		},
	],
	gender: [
		{
			required: true,
			message: "请选择性别",
			trigger: "change",
		},
	],
	phone: [
		{
			required: true,
			message: "请输入电话",
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号格式",
			trigger: "blur",
		},
	],
	idNumber: [
		{
			required: true,
			message: "请输入身份证号码",
			trigger: "blur",
		},
		{
			pattern: /^\d{17}[\dXx]$/,
			message: "请输入正确的身份证号码",
			trigger: "blur",
		},
	],
	address: [
		{
			required: true,
			message: "请输入住址",
			trigger: "blur",
		},
	],
	position: [
		{
			required: true,
			message: "请输入职位",
			trigger: "blur",
		},
	],
	post: [
		{
			required: true,
			message: "请输入岗位",
			trigger: "blur",
		},
	],
	term: [
		{
			required: true,
			message: "请输入届期",
			trigger: "blur",
		},
	],
	tenure: [
		{
			required: true,
			message: "请输入任期",
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
		<!-- 需要配置分组表单，一旦配置分组表单，columns将会失效
	    1.配置两列：
	      :row-props="{ gutter: 20 }"
	      :col-props="{
	        span: 12, //24/12=2列
	      }"
	    2.为了"身份证号码"label好看点，配置label宽度：
	      :label-width="100"
	  -->
		<PlusForm
			ref="plusFormRef"
			v-model="form"
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
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
