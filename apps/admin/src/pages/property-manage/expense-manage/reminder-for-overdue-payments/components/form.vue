<!--
  欠费催缴表单
  用于新增 修改欠费催缴记录
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { ReminderForOverduePaymentsFormVO } from "@01s-11comm/type";
import { reminderMethodOptions, reminderStatusOptions } from "@01s-11comm/type";

interface ReminderForOverduePaymentsFormProps {
	/** 表单数据 */
	form: ReminderForOverduePaymentsFormVO;
	/** 默认值 */
	defaultValues: ReminderForOverduePaymentsFormVO;
}

const props = defineProps<ReminderForOverduePaymentsFormProps>();

/** 默认表单数据 */
const defaultForm: ReminderForOverduePaymentsFormVO = {
	ownerName: "",
	paymentObject: "",
	feeName: "",
	reminderAmount: "",
	reminderMethod: "",
	reminderStatus: "",
	reminderTime: "",
	reminderRemark: "",
};

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ReminderForOverduePaymentsFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & ReminderForOverduePaymentsFormVO;

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
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入业主名称",
		},
		required: true,
	},
	{
		label: "付费对象",
		prop: "paymentObject",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入付费对象",
		},
		required: true,
	},
	{
		label: "费用名称",
		prop: "feeName",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入费用名称",
		},
		required: true,
	},
	{
		label: "催缴金额",
		prop: "reminderAmount",
		valueType: "input",
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入催缴金额",
		},
		required: true,
	},
	{
		label: "催缴方式",
		prop: "reminderMethod",
		valueType: "select",
		width: "200px",
		options: reminderMethodOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择催缴方式",
		},
		required: true,
	},
	{
		label: "催缴状态",
		prop: "reminderStatus",
		valueType: "select",
		width: "200px",
		options: reminderStatusOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择催缴状态",
		},
		required: true,
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	ownerName: [{ required: true, message: "请输入业主名称", trigger: "blur" }],
	paymentObject: [{ required: true, message: "请输入付费对象", trigger: "blur" }],
	feeName: [{ required: true, message: "请输入费用名称", trigger: "blur" }],
	reminderAmount: [{ required: true, message: "请输入催缴金额", trigger: "blur" }],
	reminderMethod: [{ required: true, message: "请选择催缴方式", trigger: "change" }],
	reminderStatus: [{ required: true, message: "请选择催缴状态", trigger: "change" }],
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
