<!--
  车辆收费表单
  用于新增 修改车辆收费
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { VehicleChargeFormVO } from "@01s-11comm/type";
import { parkingSpaceStatusOptions } from "@01s-11comm/type";
import type { FieldValues } from "plus-pro-components";

import { VehicleChargeFormProps, defaultForm } from "./form";

const props = defineProps<VehicleChargeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & VehicleChargeFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & VehicleChargeFormVO;

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
		label: "车牌号",
		prop: "licensePlateNumber",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入车牌号",
		},
	},
	{
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入业主名称",
		},
	},
	{
		label: "车位状态",
		prop: "parkingSpaceStatus",
		valueType: "select",
		options: parkingSpaceStatusOptions,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择车位状态",
		},
	},
	{
		label: "收费金额",
		prop: "chargeAmount",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入收费金额",
		},
	},
	{
		label: "收费时间",
		prop: "chargeTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
			placeholder: "请选择收费时间",
		},
		required: true,
	},
	{
		label: "收费方式",
		prop: "chargeMethod",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入收费方式",
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	licensePlateNumber: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
	ownerName: [{ required: true, message: "请输入业主名称", trigger: "blur" }],
	parkingSpaceStatus: [{ required: true, message: "请选择车位状态", trigger: "change" }],
	chargeAmount: [{ required: true, message: "请输入收费金额", trigger: "blur" }],
	chargeTime: [{ required: true, message: "请选择收费时间", trigger: "change" }],
	chargeMethod: [{ required: true, message: "请输入收费方式", trigger: "blur" }],
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
