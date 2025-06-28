<!--
  优惠申请表单
  用于新增 修改优惠申请
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { DiscountApplyFormProps, 优惠申请表单_VO, defaultForm } from "./form";

const props = defineProps<DiscountApplyFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 优惠申请表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 优惠申请表单_VO;

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
	// 房屋
	{
		label: "房屋",
		prop: "房屋",
		valueType: "input",
		required: true, //是否必填
	},

	// 申请类型
	{
		label: "申请类型",
		prop: "申请类型",
		valueType: "select",
		options: [
			{ label: "空置房", value: "空置房" },
			{ label: "123", value: "123" },
		],
		required: true,
	},

	// 费用项目
	{
		label: "费用项目",
		prop: "费用项目",
		valueType: "select",
		options: [
			{ label: "费用项目1", value: "费用项目1" },
			{ label: "费用项目2", value: "费用项目2" },
		],
		required: true,
	},

	// 申请人
	{
		label: "申请人",
		prop: "申请人",
		valueType: "input",
		required: true,
	},
	// 申请电话
	{
		label: "申请电话",
		prop: "申请电话",
		valueType: "input",
		required: true,
	},
	// 开始时间
	{
		label: "开始时间",
		prop: "开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	// 结束时间
	{
		label: "结束时间",
		prop: "结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
		required: true,
	},
	// 申请说明
	{
		label: "申请说明",
		prop: "申请说明",
		valueType: "textarea",
		required: true,
	},
	// 图片材料
	{
		label: "图片材料",
		prop: "图片材料",
		valueType: "upload",
		required: true,
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
