<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { CancelFeeFormProps, defaultForm, type CancelFeeFormVO } from "./form";
import { auditStatusOptions } from "@01s-11comm/type";

const props = defineProps<CancelFeeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & CancelFeeFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & CancelFeeFormVO;

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
		label: "批次号",
		prop: "batchNumber",
		valueType: "input",
	},
	{
		label: "员工",
		prop: "employee",
		valueType: "input",
	},
	{
		label: "时间",
		prop: "time",
		valueType: "input",
	},
	{
		label: "取消原因",
		prop: "cancelReason",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},
	{
		label: "审核状态",
		prop: "auditStatus",
		valueType: "select",
		options: auditStatusOptions,
	},
	{
		label: "审核意见",
		prop: "auditOpinion",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	auditStatus: [
		{
			required: true,
			message: "请选择审核状态",
			trigger: "change",
		},
	],
	auditOpinion: [
		{
			required: true,
			message: "请输入审核意见",
			trigger: "blur",
		},
	],
});

// 暴露给父组件使用的变量和方法
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
