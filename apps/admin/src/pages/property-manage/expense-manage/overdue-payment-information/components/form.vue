<script lang="ts" setup>
import { useTemplateRef } from "vue";
import { OverduePaymentInformationFormProps, 收费对象Options, 缴费状态Options, type 欠费信息表单_VO } from "./form";

/** 表单组件的 props */
const props = defineProps<OverduePaymentInformationFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 欠费信息表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 欠费信息表单_VO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递，扩展欠费时间范围字段
 */
const form = ref({
	...toRefForm,
	欠费时间范围: toRefForm.开始时间 && toRefForm.结束时间
		? [toRefForm.开始时间, toRefForm.结束时间]
		: ["", ""],
});

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return {
		...form.value,
		开始时间: form.value.欠费时间范围?.[0] || "",
		结束时间: form.value.欠费时间范围?.[1] || "",
	};
});

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "收费对象",
		prop: "收费对象",
		valueType: "select",
		options: 收费对象Options,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		width: "200px",
	},
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入业主姓名",
		},
		width: "200px",
	},
	{
		label: "手机号",
		prop: "手机号",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入手机号码",
		},
		width: "200px",
	},
	{
		label: "联系地址",
		prop: "联系地址",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入详细地址",
		},
		width: "300px",
	},
	{
		label: "欠费时间范围",
		prop: "欠费时间范围",
		valueType: "date-picker",
		fieldProps: {
			type: "daterange",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			startPlaceholder: "开始日期",
			endPlaceholder: "结束日期",
		},
		width: "280px",
	},
	{
		label: "欠费金额",
		prop: "欠费金额",
		valueType: "input-number",
		fieldProps: {
			precision: 2,
			min: 0,
			placeholder: "请输入欠费金额",
		},
		width: "200px",
	},
	{
		label: "缴费状态",
		prop: "缴费状态",
		valueType: "select",
		options: 缴费状态Options,
		fieldProps: {
			clearable: true,
		},
		width: "150px",
	},
	{
		label: "欠费说明",
		prop: "欠费说明",
		valueType: "textarea",
		fieldProps: {
			placeholder: "请输入欠费说明",
			rows: 3,
			maxlength: 200,
			showWordLimit: true,
		},
		width: "400px",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	收费对象: [{ required: true, message: "请选择收费对象", trigger: "change" }],
	业主名称: [
		{ required: true, message: "请输入业主名称", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	手机号: [
		{ required: true, message: "请输入手机号", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	欠费时间范围: [{ required: true, message: "请选择欠费时间范围", trigger: "change" }],
	欠费金额: [{ required: true, message: "请输入欠费金额", trigger: "blur" }],
	缴费状态: [{ required: true, message: "请选择缴费状态", trigger: "change" }],
});

// 默认导出，供外部使用
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
			:columns="plusFormColumns"
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