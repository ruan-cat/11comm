<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { OwnerMemberFormVO } from "@01s-11comm/type";
import { genderOptions, memberTypeOptions } from "@01s-11comm/type";
import type { OwnerMemberFormProps } from "./form";

const props = defineProps<OwnerMemberFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OwnerMemberFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & OwnerMemberFormVO;

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
		prop: "memberFace",
		valueType: "input",
	},

	// 名称
	{
		label: "名称",
		prop: "name",
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

	// 类型
	{
		label: "类型",
		prop: "type",
		valueType: "select",
		options: memberTypeOptions,
		required: true,
	},

	// 身份证
	{
		label: "身份证",
		prop: "idCard",
		valueType: "input",
		required: true,
	},

	// 联系方式
	{
		label: "联系方式",
		prop: "contact",
		valueType: "input",
		required: true,
	},

	// 家庭住址
	{
		label: "家庭住址",
		prop: "homeAddress",
		valueType: "input",
		required: true,
	},

	// 创建人
	{
		label: "创建人",
		prop: "creator",
		valueType: "input",
	},

	// 备注
	{
		label: "备注",
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},

	// 门禁钥匙
	{
		label: "门禁钥匙",
		prop: "accessKey",
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
	name: [
		{
			required: true,
			message: "请输入名称",
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
	type: [
		{
			required: true,
			message: "请选择类型",
			trigger: "change",
		},
	],
	idCard: [
		{
			required: true,
			message: "请输入身份证",
			trigger: "blur",
		},
	],
	contact: [
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
	homeAddress: [
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
