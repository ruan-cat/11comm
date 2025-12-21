<script lang="ts" setup>
import { useTemplateRef } from "vue";
import { type InitializeCommunityFormProps, type InitializeCommunityFormVO, statusOptions } from "./form";

const props = defineProps<InitializeCommunityFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & InitializeCommunityFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & InitializeCommunityFormVO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(toRefForm);

/**
 * 只读的表单对象 用于外部做判断
 */
const formComputed = computed(() => {
	return form.value;
});

/**
 * 表单项配置
 */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "小区ID",
		prop: "communityId",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入小区ID",
		},
	},
	{
		label: "小区名称",
		prop: "communityName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入小区名称",
		},
	},
	{
		label: "附近地标",
		prop: "nearbyLandmark",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入附近地标",
		},
	},
	{
		label: "城市编码",
		prop: "cityCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入城市编码",
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: statusOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择状态",
		},
	},
]);

/**
 * 表单项配置 动态计算 只读
 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	communityId: [
		{ required: true, message: "请输入小区ID", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	communityName: [
		{ required: true, message: "请输入小区名称", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
	],
	nearbyLandmark: [
		{ required: true, message: "请输入附近地标", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
	],
	cityCode: [
		{ required: true, message: "请输入城市编码", trigger: "blur" },
		{ min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
	],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
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
