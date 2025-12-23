<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { type PatrolPathFormProps, defaultForm } from "./form";
import type { PatrolPathFormData } from "@01s-11comm/type";
import { patrolPointTypeOptions } from "@01s-11comm/type";

const props = defineProps<PatrolPathFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PatrolPathFormData;

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
const toRefForm = structuredClone(props.form) as FieldValues & PatrolPathFormData;

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
		label: "巡检点名称",
		prop: "patrolPointName",
		valueType: "input",
		fieldProps: {
			readonly: true,
		},
	},
	{
		label: "巡检点类型",
		prop: "patrolPointType",
		valueType: "select",
		options: patrolPointTypeOptions,
	},
	{
		label: "巡检位置",
		prop: "patrolLocation",
		valueType: "input",
	},
	{
		label: "开始时间",
		prop: "startTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
	},
	{
		label: "结束时间",
		prop: "endTime",
		valueType: "time-picker",
		fieldProps: {
			format: "HH:mm",
			valueFormat: "HH:mm",
		},
	},
	{
		label: "排序",
		prop: "sortOrder",
		valueType: "input-number",
		fieldProps: {
			min: 0,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	patrolPointName: [{ required: true, message: "请输入巡检点名称", trigger: "blur" }],
	patrolPointType: [{ required: true, message: "请选择巡检点类型", trigger: "change" }],
	patrolLocation: [{ required: true, message: "请输入巡检位置", trigger: "blur" }],
	startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
	sortOrder: [{ required: true, message: "请输入排序", trigger: "blur" }],
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
