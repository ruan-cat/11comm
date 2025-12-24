<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import { PhoneRepairsFormProps, type PhoneRepairsFormVO } from "./form";
import { repairTypeOptions } from "@01s-11comm/type";

const props = defineProps<PhoneRepairsFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & PhoneRepairsFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & PhoneRepairsFormVO;

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
	// 报修范围
	{
		label: "报修范围",
		prop: "repairScope",
		valueType: "select",
		options: [
			{ label: "小区公区", value: "小区公区" },
			{ label: "业主自用", value: "业主自用" },
		],
		required: true,
	},

	// 报修类型
	{
		label: "报修类型",
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
		required: true,
	},

	// 报修人
	{
		label: "报修人",
		prop: "reporter",
		valueType: "input",
		required: true,
	},
	// 联系方式
	{
		label: "联系方式",
		prop: "contactInfo",
		valueType: "input",
		required: true,
	},
	// 预约时间
	{
		label: "预约时间",
		prop: "appointmentTime",
		valueType: "date-picker",
		required: true,
	},
	// 报修内容
	{
		label: "报修内容",
		prop: "repairDescription",
		valueType: "textarea",
		required: true,
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	repairScope: [{ required: true, message: "请选择报修范围", trigger: "change" }],
	repairType: [{ required: true, message: "请选择报修类型", trigger: "change" }],
	reporter: [{ required: true, message: "请输入报修人", trigger: "blur" }],
	contactInfo: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
	appointmentTime: [{ required: true, message: "请选择预约时间", trigger: "change" }],
	repairDescription: [{ required: true, message: "请输入报修内容", trigger: "blur" }],
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
