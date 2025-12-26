<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { WaterAndElectricityMeterReadingFormVO } from "@01s-11comm/type";

import { WaterAndElectricityMeterReadingFormProps } from "./form";

const props = defineProps<WaterAndElectricityMeterReadingFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & WaterAndElectricityMeterReadingFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & WaterAndElectricityMeterReadingFormVO;

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
	// 费用类型
	{
		label: "费用类型",
		prop: "expenseType",
		valueType: "select",
		options: [
			{ label: "水费", value: "水费" },
			{ label: "电费", value: "电费" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		width: "200px",
	},
	// 收费项目
	{
		label: "收费项目",
		prop: "chargeItem",
		valueType: "select",
		options: [
			{ label: "水表", value: "水表" },
			{ label: "电表", value: "电表" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		width: "200px",
	},
	// 抄表类型
	{
		label: "抄表类型",
		prop: "meterReadingType",
		valueType: "select",
		options: [
			{ label: "水表", value: "水表" },
			{ label: "电表", value: "电表" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
		},
		width: "200px",
	},
	// 收费对象
	{
		label: "收费对象",
		prop: "chargeObject",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入收费对象",
		},
		width: "200px",
	},
	// 上期度数
	{
		label: "上期度数",
		prop: "lastReading",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入上期度数",
		},
		width: "200px",
	},
	// 本期度数
	{
		label: "本期度数",
		prop: "currentReading",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入本期度数",
		},
		width: "200px",
	},
	// 上期读表时间
	{
		label: "上期读表时间",
		prop: "lastReadingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
		width: "220px",
	},
	// 本期读表时间
	{
		label: "本期读表时间",
		prop: "currentReadingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
		width: "220px",
	},
	// 备注
	{
		label: "备注",
		prop: "remark",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
		},
		width: "300px",
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	expenseType: [{ required: true, message: "请选择费用类型", trigger: "change" }],
	chargeItem: [{ required: true, message: "请选择收费项目", trigger: "change" }],
	meterReadingType: [{ required: true, message: "请选择抄表类型", trigger: "change" }],
	chargeObject: [
		{ required: true, message: "请输入收费对象", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" } as any,
	],
	lastReading: [
		{ required: true, message: "请输入上期度数", trigger: "blur" },
		{ pattern: /^\d+$/, message: "请输入有效的数字", trigger: "blur" } as any,
	],
	currentReading: [
		{ required: true, message: "请输入本期度数", trigger: "blur" },
		{ pattern: /^\d+$/, message: "请输入有效的数字", trigger: "blur" } as any,
	],
	lastReadingTime: [{ required: true, message: "请选择上期读表时间", trigger: "change" }],
	currentReadingTime: [{ required: true, message: "请选择本期读表时间", trigger: "change" }],
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
