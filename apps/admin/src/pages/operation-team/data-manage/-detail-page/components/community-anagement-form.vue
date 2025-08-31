<!--
  费用项设置表单
  用于新增 修改费用项设置
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { CommunityManagementFormProps, 管理小区表单_VO, defaultForm } from "./community-anagement-form";
import { useDisabled, useFormDisabled } from "element-plus";

const props = defineProps<CommunityManagementFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 管理小区表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 管理小区表单_VO;

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
// 修改表单项配置为计算属性
const plusFormColumns = computed<PlusColumn[]>(() => {
	// 基础表单项
	const baseColumns: PlusColumn[] = [
		// 开通小区
		{
			label: "开通小区",
			prop: "开通小区",
			valueType: "select",
			// option: "", //此处应该调用j5组【获取未入驻物业的小区名称列表】
			options: [
				{ label: "0011小区", value: "0011小区" },
				{ label: "阿尼亚小区", value: "阿尼亚小区" },
				{ label: "飞小区", value: "飞小区" },
				{ label: "翠绿小区", value: "翠绿小区" },
				{ label: "蓝天小区", value: "蓝天小区" },
			],
		},
		// 功能
		{
			label: "功能",
			prop: "功能",
			valueType: "checkbox",
			options: [
				// //原型全部checkbox仅有全部取消功能，弹窗的重置理论上可以替代
				// {
				// 	label: "全部",
				// 	value: "0",
				// },

				//无意义，但好看的静态checkbox：理论上应该调用j1菜单组接口获取全部小区功能
				{
					label: "巡楼",
					value: "0",
				},
				{
					label: "OV",
					value: "2",
				},
				{
					label: "手机工单",
					value: "3",
				},
				{
					label: "手机核销",
					value: "4",
				},
				{
					label: "手机停车",
					value: "5",
				},
				{
					label: "手机报表",
					value: "6",
				},
				{
					label: "预约",
					value: "7",
				},
				{
					label: "优惠",
					value: "8",
				},
				{
					label: "物业手机版",
					value: "9",
				},
				{
					label: "报表",
					value: "10",
				},
				{
					label: "合同",
					value: "11",
				},
				{
					label: "巡检",
					value: "12",
				},
				{
					label: "停车",
					value: "13",
				},
				{
					label: "设备",
					value: "14",
				},
				{
					label: "费用",
					value: "15",
				},
				{
					label: "报修",
					value: "16",
				},
				{
					label: "系统",
					value: "17",
				},
				{
					label: "采购",
					value: "18",
				},
				{
					label: "办公",
					value: "19",
				},
				{
					label: "房产",
					value: "20",
				},
				{
					label: "小区",
					value: "21",
				},
				{
					label: "组织",
					value: "22",
				},
			],
		},
	];
	return baseColumns;
});

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
		v-model="form"
		class="form-root"
		:has-footer="false"
		:default-values="defaultValues"
		:columns="plusFormColumnsComputed"
		:rules="plusFormRules"
		:label-width="90"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
