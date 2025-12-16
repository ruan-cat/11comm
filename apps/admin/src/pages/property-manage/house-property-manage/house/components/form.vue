<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { type HouseManageFormProps, HouseManagementFormVO, houseTypeOptions, houseStatusOptions } from "./form";
import type { FieldValues } from "plus-pro-components";

const props = defineProps<HouseManageFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & HouseManagementFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & HouseManagementFormVO;

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
		label: "房屋编号",
		prop: "house",
		valueType: "input",
	},
	{
		label: "楼层",
		prop: "floor",
		valueType: "input",
	},
	{
		label: "业主",
		prop: "owner",
		valueType: "input",
	},
	{
		label: "类型",
		prop: "type",
		valueType: "select",
		options: houseTypeOptions,
	},
	{
		label: "房屋面积",
		prop: "houseArea",
		valueType: "input",
	},
	{
		label: "租金",
		prop: "rent",
		valueType: "input",
	},
	{
		label: "房屋状态",
		prop: "houseStatus",
		valueType: "select",
		options: houseStatusOptions,
	},
	{
		label: "有效期",
		prop: "validUntil",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	house: [
		{
			required: true,
			message: "请输入房屋编号",
			trigger: "blur",
		},
	],
	floor: [
		{
			required: true,
			message: "请输入楼层",
			trigger: "blur",
		},
	],
	owner: [
		{
			required: true,
			message: "请输入业主",
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: "请选择类型",
			trigger: "change",
		},
	],
	houseArea: [
		{
			required: true,
			message: "请输入房屋面积",
			trigger: "blur",
		},
	],
	rent: [
		{
			required: true,
			message: "请输入租金",
			trigger: "blur",
		},
	],
	houseStatus: [
		{
			required: true,
			message: "请选择房屋状态",
			trigger: "change",
		},
	],
	validUntil: [
		{
			required: true,
			message: "请选择有效期",
			trigger: "change",
		},
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
