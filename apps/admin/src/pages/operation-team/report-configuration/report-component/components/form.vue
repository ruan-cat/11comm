<!--
  报表组件表单
  用于新增 修改报表组件信息
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { ReportComponentFormProps, ReportComponentFormVO, defaultForm } from "./form";

const props = defineProps<ReportComponentFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ReportComponentFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & ReportComponentFormVO;

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
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: "组件名称",
		prop: "componentName",
		valueType: "input",
		required: true,
	},
	{
		label: "组件类型",
		prop: "componentType",
		valueType: "select",
		options: [
			{ label: "表格", value: "表格" },
			{ label: "饼状图", value: "饼状图" },
		],
		required: true,
	},
	{
		label: "查询方式",
		prop: "queryMethod",
		valueType: "select",
		options: [
			{ label: "SQL", value: "sql" },
			{ label: "JAVA", value: "java" },
		],
		required: true,
	},
	{
		label: "SQL",
		prop: "sql",
		valueType: "textarea",
		hidden: () => form.value.queryMethod !== "sql",
	},
	{
		label: "JAVA",
		prop: "java",
		valueType: "textarea",
		hidden: () => form.value.queryMethod !== "java",
	},
	{
		label: "描述",
		prop: "description",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({});

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
