<!--
  车辆收费表单
  用于新增 修改车辆收费
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import {VehicleChargeFormProps, 费用类型, 车辆收费表单_VO, defaultForm,, feeTypeOptions} from "./form";

const props = defineProps<VehicleChargeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 车辆收费表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 车辆收费表单_VO;

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
	//收费范围
	{
		label: "收费范围",
		prop: "收费范围",
		valueType: "select",
		options: [
			{ label: "小区", value: "小区" },
			{ label: "停车场", value: "停车场" },
		],
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请选择收费范围",
		},
	},
	// 费用类型
	{
		label: "费用类型",
		prop: "费用类型",
		valueType: "select",
		options: feeTypeOptions,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择费用类型",
		},
	},
	// 收费项目
	{
		label: "收费项目",
		prop: "收费项目",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入收费项目（如车牌号）",
		},
	},
	//车位状态
	{
		label: "车位状态",
		prop: "车位状态",
		valueType: "select",
		options: [
			{ label: "已出售", value: "已出售" },
			{ label: "已出租", value: "已出租" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择车位状态",
		},
	},
	//计费起始时间
	{
		label: "计费起始时间",
		prop: "计费起始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: "请选择计费起始时间",
		},
		required: true,
	},
	//计费结束时间
	{
		label: "计费结束时间",
		prop: "计费结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: "请选择计费结束时间",
		},
		required: true,
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	收费范围: [{ required: true, message: "请选择收费范围", trigger: "change" }],
	费用类型: [{ required: true, message: "请选择费用类型", trigger: "change" }],
	收费项目: [
		{ required: true, message: "请输入收费项目", trigger: "blur" },
		{ min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" },
	],
	计费起始时间: [{ required: true, message: "请选择计费起始时间", trigger: "change" }],
	计费结束时间: [
		{ required: true, message: "请选择计费结束时间", trigger: "change" },
		{
			validator: (rule, value, callback) => {
				if (value && form.value.计费起始时间 && value < form.value.计费起始时间) {
					callback(new Error("计费结束时间不能早于计费起始时间"));
				} else {
					callback();
				}
			},
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
