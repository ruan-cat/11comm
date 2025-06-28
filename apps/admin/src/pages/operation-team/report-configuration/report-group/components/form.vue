<!--
  报表组表单
  用于新增 修改报表组信息
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { ReportGroupFormProps, 报表组类型, 报表组表单_VO, defaultForm } from "./form";

const props = defineProps<ReportGroupFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 报表组表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 报表组表单_VO;

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
		label: "组名称",
		prop: "组名称",
		valueType: "input",
		required: true,
	},
	{
		label: "组url",
		prop: "组url",
		valueType: "input",
		required: true,
	},
	{
		label: "描述",
		prop: "描述",
		valueType: "input",
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
