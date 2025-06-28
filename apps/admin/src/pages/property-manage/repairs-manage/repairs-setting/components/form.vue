<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { RepairsSettingFormProps, 报修设置表单_VO, defaultForm } from "./form";

const props = defineProps<RepairsSettingFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 报修设置表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 报修设置表单_VO;

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
	// 类型名称
	{
		label: "类型名称",
		prop: "类型名称",
		valueType: "input",
		required: true,
	},

	// 设置类型
	{
		label: "设置类型",
		prop: "设置类型",
		valueType: "select",
		options: [
			{ label: "保洁单", value: "保洁单" },
			{ label: "维修单", value: "维修单" },
		],
		required: true,
	},
	// 派单方式
	{
		label: "派单方式",
		prop: "派单方式",
		valueType: "select",
		options: [
			{ label: "抢单", value: "抢单" },
			{ label: "指派", value: "指派" },
			{ label: "轮训", value: "轮训" },
		],
		required: true,
	},
	// 公共区域
	{
		label: "公共区域",
		prop: "公共区域",
		valueType: "select",
		options: [
			{ label: "非房屋", value: "非房屋" },
			{ label: "房屋", value: "房屋" },
		],
		required: true,
	},
	// 业主端展示
	{
		label: "业主端展示",
		prop: "业主端展示",
		valueType: "select",
		options: [
			{ label: "是", value: "是" },
			{ label: "否", value: "否" },
		],
		required: true,
	},

	// 通知方式
	{
		label: "通知方式",
		prop: "通知方式",
		valueType: "select",
		options: [
			{ label: "短信", value: "短信" },
			{ label: "微信", value: "微信" },
			{ label: "微信+员工工牌", value: "微信+员工工牌" },
		],
		required: true,
	},

	// 回访设置
	{
		label: "回访设置",
		prop: "回访设置",
		valueType: "select",
		options: [
			{ label: "不回访", value: "不回访" },
			{ label: "已评价不回访", value: "已评价不回访" },
			{ label: "回访", value: "回访" },
		],
		required: true,
	},

	// 说明
	{
		label: "说明",
		prop: "说明",
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
