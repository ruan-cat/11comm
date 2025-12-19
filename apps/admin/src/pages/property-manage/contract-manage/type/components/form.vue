<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import type { FieldValues } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import type { PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";

import { AddFormProps, ContractTypeFormVO, defaultForm, auditTypeOptions } from "./form";

const props = defineProps<AddFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ContractTypeFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & ContractTypeFormVO;

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
	/** 类型名称 */
	{
		label: "类型名称",
		prop: "typeName",
		valueType: "input",
		required: true,
		fieldProps: {
			clearable: true,
			placeholder: "请输入合同类型名称",
		},
	},

	/** 是否审核 */
	{
		label: "是否审核",
		prop: "isAudit",
		valueType: "select",
		options: auditTypeOptions,
		required: true,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},

	/** 描述 */
	{
		label: "描述",
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			clearable: true,
			placeholder: "请输入合同类型的详细描述",
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	typeName: [
		{ required: true, message: "请输入类型名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	isAudit: [
		{ required: true, message: "请选择是否审核", trigger: "change" },
	],
	description: [
		{ max: 500, message: "描述长度不能超过500个字符", trigger: "blur" },
	],
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
