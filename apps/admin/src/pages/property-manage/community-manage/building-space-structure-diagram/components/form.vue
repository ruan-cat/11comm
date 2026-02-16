<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import type { BuildingSpaceStructureDiagramFormVO } from "@01s-11comm/type";
import { buildingStructureOptions, buildingStatusOptions } from "@01s-11comm/type";

import { BuildingSpaceStructureDiagramFormProps } from "./form";

const props = defineProps<BuildingSpaceStructureDiagramFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & BuildingSpaceStructureDiagramFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & BuildingSpaceStructureDiagramFormVO;

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
		label: "楼栋编号",
		prop: "buildingNumber",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入楼栋编号",
		},
	},
	{
		label: "楼栋名称",
		prop: "buildingName",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入楼栋名称",
		},
	},
	{
		label: "总楼层",
		prop: "totalFloors",
		valueType: "input-number",
		fieldProps: {
			min: 1,
			max: 100,
			placeholder: "请输入总楼层数",
		},
	},
	{
		label: "总户数",
		prop: "totalUnits",
		valueType: "input-number",
		fieldProps: {
			min: 1,
			max: 1000,
			placeholder: "请输入总户数",
		},
	},
	{
		label: "建筑面积",
		prop: "buildingArea",
		valueType: "input-number",
		fieldProps: {
			min: 0,
			precision: 1,
			placeholder: "请输入建筑面积（平方米）",
		},
	},
	{
		label: "建筑结构",
		prop: "buildingStructure",
		valueType: "select",
		options: buildingStructureOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择建筑结构",
		},
	},
	{
		label: "建成年份",
		prop: "constructionYear",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入建成年份",
		},
	},
	{
		label: "图纸路径",
		prop: "blueprintPath",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入图纸路径",
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: buildingStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择楼栋状态",
		},
	},
	{
		label: "负责人",
		prop: "responsiblePerson",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入负责人姓名",
		},
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入联系电话",
		},
	},
	{
		label: "备注",
		prop: "remarks",
		valueType: "textarea",
		fieldProps: {
			clearable: true,
			placeholder: "请输入备注信息",
			rows: 3,
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	buildingNumber: [{ required: true, message: "请输入楼栋编号", trigger: "blur" }],
	buildingName: [{ required: true, message: "请输入楼栋名称", trigger: "blur" }],
	totalFloors: [
		{ required: true, message: "请输入总楼层数", trigger: "blur" },
		{ type: "number", min: 1, message: "楼层数不能小于1", trigger: "blur" },
	],
	totalUnits: [
		{ required: true, message: "请输入总户数", trigger: "blur" },
		{ type: "number", min: 1, message: "总户数不能小于1", trigger: "blur" },
	],
	buildingArea: [
		{ required: true, message: "请输入建筑面积", trigger: "blur" },
		{ type: "number", min: 0, message: "建筑面积不能小于0", trigger: "blur" },
	],
	buildingStructure: [{ required: true, message: "请选择建筑结构", trigger: "change" }],
	constructionYear: [{ required: true, message: "请输入建成年份", trigger: "blur" }],
	blueprintPath: [{ required: true, message: "请输入图纸路径", trigger: "blur" }],
	status: [{ required: true, message: "请选择楼栋状态", trigger: "change" }],
	responsiblePerson: [{ required: true, message: "请输入负责人姓名", trigger: "blur" }],
	contactPhone: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
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
