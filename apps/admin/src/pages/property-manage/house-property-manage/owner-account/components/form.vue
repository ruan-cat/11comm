<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { OwnerAccountFormProps, 业主账户表单_VO, defaultForm } from "./form";

const props = defineProps<OwnerAccountFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 业主账户表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 业主账户表单_VO;

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
	// 账户类型
	{
		label: "账户类型",
		prop: "账户类型",
		valueType: "select",
		options: [
			{ label: "通用账户", value: "通用账户" },
			{ label: "物业费扣款账户", value: "物业费扣款账户" },
			{ label: "水电费扣款账户", value: "水电费扣款账户" },
		],
		required: true,
	},

	// 业主手机
	{
		label: "业主手机",
		prop: "业主手机",
		valueType: "input",
		required: true,
	},

	// 业主名称
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "select",
		options: [
			{ label: "1", value: "1" },
			{ label: "2", value: "2" },
		],
		required: true,
	},
	// 预存金额
	{
		label: "预存金额",
		prop: "预存金额",
		valueType: "input",
		required: true,
	},
	// 支付方式
	{
		label: "支付方式",
		prop: "支付方式",
		valueType: "select",
		options: [
			{ label: "现金", value: "现金" },
			{ label: "POS刷卡", value: "POS刷卡" },
			{ label: "微信二维码", value: "微信二维码" },
			{ label: "支付宝二维码", value: "支付宝二维码" },
			{ label: "转账", value: "转账" },
			{ label: "押金退款到账户", value: "押金退款到账户" },
		],
	},
	// 备注
	{
		label: "备注",
		prop: "备注",
		valueType: "textarea",
		required: false,
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
		class="form-root"
		:has-footer="false"
		v-model="form"
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
