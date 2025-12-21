<!--
  费用汇总表表单
  用于新增或修改费用汇总表数据
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { ExpenseSummaryTableFormProps, ExpenseSummaryTableFormVO, defaultForm } from "./form";

const props = defineProps<ExpenseSummaryTableFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ExpenseSummaryTableFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & ExpenseSummaryTableFormVO;

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
	// 时间
	{
		label: "时间",
		prop: "time",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入时间",
		},
	},

	// 费用项ID
	{
		label: "费用项ID",
		prop: "expenseItemId",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入费用项ID",
		},
	},

	// 费用项名称
	{
		label: "费用项名称",
		prop: "expenseItemName",
		valueType: "select",
		options: [
			{ label: "物业费", value: "物业费" },
			{ label: "水费", value: "水费" },
			{ label: "电费", value: "电费" },
			{ label: "燃气费", value: "燃气费" },
			{ label: "停车费", value: "停车费" },
			{ label: "电梯费", value: "电梯费" },
			{ label: "垃圾处理费", value: "垃圾处理费" },
			{ label: "绿化费", value: "绿化费" },
			{ label: "安防费", value: "安防费" },
			{ label: "维修基金", value: "维修基金" },
		],
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择费用项名称",
		},
	},

	// 应收金额
	{
		label: "应收金额",
		prop: "receivableAmount",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入应收金额",
		},
	},

	// 实收金额
	{
		label: "实收金额",
		prop: "actualAmount",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入实收金额",
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	time: [{ required: true, message: "请输入时间", trigger: "blur" }],
	expenseItemId: [{ required: true, message: "请输入费用项ID", trigger: "blur" }],
	expenseItemName: [{ required: true, message: "请选择费用项名称", trigger: "change" }],
	receivableAmount: [
		{ required: true, message: "请输入应收金额", trigger: "blur" },
		{ pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额格式", trigger: "blur" },
	],
	actualAmount: [
		{ required: true, message: "请输入实收金额", trigger: "blur" },
		{ pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额格式", trigger: "blur" },
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
