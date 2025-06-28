<!--
  水电抄表表单
  用于新增 修改水电抄表
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { WaterAndElectricityMeterReadingFormProps, 费用类型, 水电抄表表单_VO, defaultForm } from "./form";

const props = defineProps<WaterAndElectricityMeterReadingFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 水电抄表表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 水电抄表表单_VO;

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
		prop: "费用类型",
		required: true,
	},

	// 收费项目
	{
		label: "收费项目",
		prop: "收费项目",
		valueType: "input",
		required: true,
	},
	// 抄表类型
	{
		label: "抄表类型",
		prop: "抄表类型",
		valueType: "select",
		options: [
			{ label: "水费", value: "水费" },
			{ label: "电费", value: "电费" },
		],
		required: true,
	},
	// 收费对象
	{
		label: "收费对象",
		prop: "收费对象",
		hide: true,
		valueType: "input",
		required: true,
	},
	// 上期度数
	{
		label: "上期度数",
		prop: "上期度数",
		valueType: "input",
		required: true,
	},
	// 本期度数
	{
		label: "本期度数",
		prop: "本期度数",
		valueType: "input",
		required: true,
	},
	// 上期读表时间
	{
		label: "上期读表时间",
		prop: "上期读表时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	// 本期读表时间
	{
		label: "本期读表时间",
		prop: "本期读表时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	// 备注
	{
		label: "备注",
		prop: "备注",
		valueType: "input",
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
	<PlusForm
		ref="plusFormRef"
		v-model="form"
		class="form-root"
		:has-footer="false"
		:default-values="defaultValues"
		:columns="plusFormColumnsComputed"
		:rules="plusFormRules"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
