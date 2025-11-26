<!--
  合同甲方表单
  用于新增、修改合同甲方
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { type FirstPartyFormProps, type 合同甲方表单_VO, defaultForm } from "./form";

const props = defineProps<FirstPartyFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 合同甲方表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 合同甲方表单_VO;

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
		label: "甲方",
		prop: "甲方",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入甲方名称",
		},
	},

	{
		label: "甲方联系人",
		prop: "甲方联系人",
		valueType: "input",
		required: true,
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入甲方联系人姓名",
		},
	},

	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
		required: true,
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入11位手机号码",
		},
	},

	{
		label: "地址",
		prop: "地址",
		valueType: "input",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入详细地址",
		},
	},

	{
		label: "统一社会信用代码",
		prop: "统一社会信用代码",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入18位统一社会信用代码",
		},
	},

	{
		label: "成立日期",
		prop: "成立日期",
		valueType: "date-picker",
		required: true,
		width: "180px",
		fieldProps: {
			clearable: true,
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			placeholder: "请选择成立日期",
		},
	},

	{
		label: "法定代表人",
		prop: "法定代表人",
		valueType: "input",
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入法定代表人姓名",
		},
	},

	{
		label: "经营范围",
		prop: "经营范围",
		valueType: "textarea",
		width: "400px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入经营范围，如：房地产开发、物业管理等",
			rows: 4,
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	甲方: [
		{ required: true, message: "请输入甲方名称", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
	],
	甲方联系人: [
		{ required: true, message: "请输入甲方联系人", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	联系电话: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	地址: [
		{ min: 5, max: 200, message: "长度在 5 到 200 个字符", trigger: "blur" },
	],
	统一社会信用代码: [
		{ pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: "请输入正确的统一社会信用代码", trigger: "blur" },
	],
	成立日期: [
		{ required: true, message: "请选择成立日期", trigger: "change" },
	],
	法定代表人: [
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	经营范围: [
		{ min: 5, max: 500, message: "长度在 5 到 500 个字符", trigger: "blur" },
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
