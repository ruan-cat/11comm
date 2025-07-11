<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { SystemConfigFormProps, SystemConfigForm, defaultForm } from "./form";

const props = defineProps<SystemConfigFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & SystemConfigForm;

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
const toRefForm = cloneDeep(props.form) as FieldValues & SystemConfigForm;

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
		label: "标题名称",
		prop: "title",
		valueType: "input",
	},
	{
		label: "副标题",
		prop: "subtitle",
		valueType: "input",
	},
	{
		label: "简写标题",
		prop: "shortName",
		valueType: "input",
	},
	{
		label: "公司名称",
		prop: "companyName",
		valueType: "input",
	},
	{
		label: "logo地址",
		prop: "logoUrl",
		valueType: "input",
	},
	{
		label: "静态url",
		prop: "staticUrl",
		valueType: "input",
	},
	{
		label: "默认小区编号",
		prop: "defaultCommunityCode",
		valueType: "input",
	},
	{
		label: "业主标题",
		prop: "ownerTitle",
		valueType: "input",
	},
	{
		label: "物业手机标题",
		prop: "propertyMobileTitle",
		valueType: "input",
	},
	{
		label: "qq地图key",
		prop: "qqMapKey",
		valueType: "input",
	},
	{
		label: "商城地址",
		prop: "mallUrl",
		valueType: "input",
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
		class="form-root"
		:has-footer="false"
		v-model="form"
		:default-values="defaultValues"
		:columns="plusFormColumnsComputed"
		:rules="plusFormRules"
		label-width="120px"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
