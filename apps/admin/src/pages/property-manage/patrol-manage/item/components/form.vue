<!--
  巡检项目表单
  用于新增 修改巡检项目
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { PatrolItemFormProps } from "./form";
import type { PatrolItemFormVO } from "@01s-11comm/type";

const props = defineProps<PatrolItemFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PatrolItemFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & PatrolItemFormVO;

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
		label: "编号",
		prop: "code",
		valueType: "input",
		required: true,
	},
	{
		label: "巡检项目",
		prop: "patrolItem",
		valueType: "input",
		required: true,
	},
	{
		label: "创建时间",
		prop: "createTime",
		valueType: "date-picker",
		required: true,
	},
	{
		label: "备注",
		prop: "remark",
		valueType: "input",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	code: [
		{
			required: true,
			message: "请输入编号",
			trigger: "blur",
		},
	],
	patrolItem: [
		{
			required: true,
			message: "请输入巡检项目",
			trigger: "blur",
		},
	],
	createTime: [
		{
			required: true,
			message: "请选择创建时间",
			trigger: "change",
		},
	],
});

/** 对外导出 */
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
