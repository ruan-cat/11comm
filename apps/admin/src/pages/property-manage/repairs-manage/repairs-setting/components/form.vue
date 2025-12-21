<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import { RepairsSettingFormProps, type 报修设置表单_VO } from "./form";

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
const toRefForm = structuredClone(props.form) as FieldValues & 报修设置表单_VO;

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
		options: 报修设置类型Options,
		required: true,
	},
	// 派单方式
	{
		label: "派单方式",
		prop: "派单方式",
		valueType: "select",
		options: 派单方式Options,
		required: true,
	},
	// 公共区域
	{
		label: "公共区域",
		prop: "公共区域",
		valueType: "select",
		options: 区域Options,
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
		options: 回访设置Options,
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

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	类型名称: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
	设置类型: [{ required: true, message: "请选择设置类型", trigger: "change" }],
	派单方式: [{ required: true, message: "请选择派单方式", trigger: "change" }],
	公共区域: [{ required: true, message: "请选择公共区域", trigger: "change" }],
	业主端展示: [{ required: true, message: "请选择业主端展示", trigger: "change" }],
	通知方式: [{ required: true, message: "请选择通知方式", trigger: "change" }],
	回访设置: [{ required: true, message: "请选择回访设置", trigger: "change" }],
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
