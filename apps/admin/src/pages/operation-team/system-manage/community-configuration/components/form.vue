<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { CommunityConfigurationFormProps, defaultForm } from "./form";
import { type 小区配置表单_VO, 设置类型选项, 数据状态选项 } from "../test-data";

/** 表单组件的 props */
const props = defineProps<CommunityConfigurationFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 小区配置表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 小区配置表单_VO;

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
		label: "小区名称",
		prop: "小区名称",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "设置名称",
		prop: "settingName",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "设置值",
		prop: "settingValue",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "设置类型",
		prop: "settingType",
		valueType: "select",
		options: 设置类型选项,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: "数据状态",
		prop: "statusCd",
		valueType: "select",
		options: 数据状态选项,
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "备注",
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	小区名称: [
		{ required: true, message: "请输入小区名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	settingName: [
		{ required: true, message: "请输入设置名称", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
	],
	settingValue: [
		{ required: true, message: "请输入设置值", trigger: "blur" },
		{ min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur" },
	],
	settingType: [
		{ required: true, message: "请选择设置类型", trigger: "change" },
	],
	statusCd: [
		{ required: true, message: "请选择数据状态", trigger: "change" },
	],
});

// 默认对外导出
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