<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { OwnerMemberFormProps, type 业主成员表单_VO, defaultForm } from "./form";
import { 性别选项, 成员类型选项 } from "../test-data";

const props = defineProps<OwnerMemberFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 业主成员表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 业主成员表单_VO;

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
	// 成员人脸
	{
		label: "成员人脸",
		prop: "成员人脸",
		valueType: "input",
	},

	// 名称
	{
		label: "名称",
		prop: "名称",
		valueType: "input",
		required: true,
	},

	// 性别
	{
		label: "性别",
		prop: "性别",
		valueType: "select",
		options: 性别选项,
		required: true,
	},

	// 类型
	{
		label: "类型",
		prop: "类型",
		valueType: "select",
		options: 成员类型选项,
		required: true,
	},

	// 身份证
	{
		label: "身份证",
		prop: "身份证",
		valueType: "input",
		required: true,
	},

	// 联系方式
	{
		label: "联系方式",
		prop: "联系方式",
		valueType: "input",
		required: true,
	},

	// 家庭住址
	{
		label: "家庭住址",
		prop: "家庭住址",
		valueType: "input",
		required: true,
	},

	// 创建人
	{
		label: "创建人",
		prop: "创建人",
		valueType: "input",
	},

	// 备注
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},

	// 门禁钥匙
	{
		label: "门禁钥匙",
		prop: "门禁钥匙",
		valueType: "select",
		options: [
			{ label: "有", value: "有" },
			{ label: "无", value: "无" },
		],
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	名称: [
		{
			required: true,
			message: "请输入名称",
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
	类型: [
		{
			required: true,
			message: "请选择类型",
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
	联系方式: [
		{
			required: true,
			message: "请输入联系方式",
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号格式",
			trigger: "blur",
		},
	],
	家庭住址: [
		{
			required: true,
			message: "请输入家庭住址",
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
			:label-width="90"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
