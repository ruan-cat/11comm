<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { PropertyManagementCompanyFormProps, 物业公司表单_VO, defaultForm } from "./form";
import { useDisabled, useFormDisabled } from "element-plus";

const props = defineProps<PropertyManagementCompanyFormProps & { mode: Mode }>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 物业公司表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 物业公司表单_VO;

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
// 修改表单项配置为计算属性
const plusFormColumns = computed<PlusColumn[]>(() => {
	// 基础表单项（编辑和新增都需要的）
	const baseColumns: PlusColumn[] = [
		// 名称
		{
			label: "名称",
			prop: "名称",
			valueType: "input",
			required: true,
		},
		// 地址
		{
			label: "地址",
			prop: "地址",
			valueType: "input",
			required: true,
		},
		// 电话
		{
			label: "电话",
			prop: "电话",
			valueType: "input",
			required: true,
		},
		// 公司法人
		{
			label: "公司法人",
			prop: "公司法人",
			valueType: "input",
			required: true,
		},
		// 成立日期
		{
			label: "成立日期",
			prop: "成立日期",
			valueType: "date-picker",
			required: true,
		},
		// 地标
		{
			label: "地标",
			prop: "地标",
			valueType: "input",
			required: true,
		},
	];

	// 只在新增模式下显示的表单项
	if (props.mode === "add") {
		baseColumns.push({
			label: "开通小区",
			prop: "开通小区",
			valueType: "select",
			options: [{ label: "零壹小区", value: "零壹小区" }],
		});
	}

	return baseColumns;
});

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
		:label-width="90"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
