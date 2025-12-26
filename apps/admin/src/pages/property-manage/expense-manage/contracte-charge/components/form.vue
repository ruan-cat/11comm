<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { ContractFeeType, ContracteChargeFormVO } from "@01s-11comm/type";

import { ContracteChargeFormProps, defaultForm } from "./form";

const props = defineProps<ContracteChargeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ContracteChargeFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & ContracteChargeFormVO;

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
		prop: "feeType",
		valueType: "select",
		options: [
			{ label: "物业费", value: "物业费" },
			{ label: "押金", value: "押金" },
			{ label: "煤气费", value: "煤气费" },
			{ label: "取暖费", value: "取暖费" },
			{ label: "维修费", value: "维修费" },
			{ label: "服务费", value: "服务费" },
			{ label: "其他", value: "其他" },
			{ label: "系统费用", value: "系统费用" },
			{ label: "租金", value: "租金" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	// 收费项目
	{
		label: "收费项目",
		prop: "chargeItem",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入收费项目",
		},
	},

	// 合同状态
	{
		label: "合同状态",
		prop: "contractStatus",
		valueType: "select",
		options: [
			{ label: "待审核", value: "待审核" },
			{ label: "审核中", value: "审核中" },
			{ label: "审核完成", value: "审核完成" },
		],
		required: true,
		fieldProps: {
			clearable: true,
		},
	},

	// 计费起始时间
	{
		label: "计费起始时间",
		prop: "billingStartTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
	},

	// 计费结束时间
	{
		label: "计费结束时间",
		prop: "billingEndTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
			clearable: true,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	feeType: [{ required: true, message: "请选择费用类型", trigger: "change" }],
	chargeItem: [{ required: true, message: "请输入收费项目", trigger: "blur" }],
	contractStatus: [{ required: true, message: "请选择合同状态", trigger: "change" }],
	billingStartTime: [{ required: true, message: "请选择计费起始时间", trigger: "change" }],
	billingEndTime: [{ required: true, message: "请选择计费结束时间", trigger: "change" }],
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
