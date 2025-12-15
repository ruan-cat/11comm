<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { CatalogFormProps, defaultForm, MenuCatalogFormData, groupTypeOptions, storeTypeOptions } from "./form";

/** 表单组件的 props Form component props */
const props = defineProps<CatalogFormProps>();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & MenuCatalogFormData;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = cloneDeep(props.form) as FieldValues & MenuCatalogFormData;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 Form columns configuration */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "菜单组名称",
		prop: "name",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "图标",
		prop: "icon",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "标签",
		prop: "label",
		valueType: "input",
		fieldProps: {
			clearable: true,
		},
	},
	{
		label: "序列",
		prop: "seq",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			max: 999,
		},
	},
	{
		label: "组类型",
		prop: "groupType",
		valueType: "select",
		options: groupTypeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: "归属商户",
		prop: "storeType",
		valueType: "select",
		options: storeTypeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
	{
		label: "描述",
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			rows: 3,
		},
	},
]);

/** 表单校验规则 Form validation rules */
const plusFormRules = ref<PlusFormRules>({
	name: [
		{ required: true, message: "请输入菜单组名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	icon: [{ required: true, message: "请输入图标", trigger: "blur" }],
	label: [{ required: true, message: "请输入标签", trigger: "blur" }],
	seq: [
		{ required: true, message: "请输入序列", trigger: "blur" },
		{ type: "number", min: 0, max: 999, message: "序列必须在0-999之间", trigger: "blur" },
	],
	groupType: [{ required: true, message: "请选择组类型", trigger: "change" }],
	storeType: [{ required: true, message: "请选择归属商户", trigger: "change" }],
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
