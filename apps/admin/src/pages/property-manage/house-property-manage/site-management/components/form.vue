<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { SiteManagementFormProps, 费用类型, 场地管理_VO, defaultForm } from "./form";

const props = defineProps<SiteManagementFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 场地管理_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 场地管理_VO;

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
	// 名称
	{
		label: "名称",
		prop: "名称",
		required: true,
	},

	// 每小时费用
	{
		label: "每小时费用",
		prop: "每小时费用",
		valueType: "input",
		required: true,
	},

	// 管理员
	{
		label: "管理员",
		prop: "管理员",
		required: true,
	},

	// 管理员电话
	{
		label: "管理员电话",
		prop: "管理员电话",
		required: true,
	},
	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: [
			{ label: "可预约", value: "可预约" },
			{ label: "不可预约", value: "不可预约" },
		],
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
