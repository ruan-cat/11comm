<!--
  小区管理表单
  用于新增 修改小区信息
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { CommunityManageFormProps, CommunityManageFormVO, communityOptions } from "./form";
import type { Mode } from "@/composables/use-mode";

interface FormProps extends CommunityManageFormProps {
	/** 表单模式 */
	mode?: Mode;
}

const props = withDefaults(defineProps<FormProps>(), {
	mode: "add",
});

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & CommunityManageFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & CommunityManageFormVO;

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

/** 省份选项 */
const provinceOptions = [
	{ label: "请选择省份", value: "" },
	{ label: "福建省", value: "福建省" },
	{ label: "广东省", value: "广东省" },
	{ label: "浙江省", value: "浙江省" },
	{ label: "江苏省", value: "江苏省" },
	{ label: "北京市", value: "北京市" },
	{ label: "上海市", value: "上海市" },
	{ label: "四川省", value: "四川省" },
	{ label: "湖北省", value: "湖北省" },
	{ label: "山东省", value: "山东省" },
];

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "省份",
		prop: "province",
		valueType: "select",
		options: provinceOptions,
		required: true,
	},
	{
		label: "城市",
		prop: "city",
		valueType: "input",
		required: true,
	},
	{
		label: "区县",
		prop: "district",
		valueType: "input",
		required: true,
	},
	{
		label: "小区名称",
		prop: "name",
		valueType: "input",
		required: true,
	},
	{
		label: "小区编码",
		prop: "code",
		valueType: "input",
		required: true,
	},
	{
		label: "客服电话",
		prop: "servicePhone",
		valueType: "input",
		required: true,
	},
	{
		label: "面积",
		prop: "area",
		valueType: "input",
		required: true,
	},
	{
		label: "开始时间",
		prop: "startTime",
		valueType: "date-picker",
		required: true,
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			"value-format": "YYYY-MM-DD",
		},
	},
	{
		label: "结束时间",
		prop: "endTime",
		valueType: "date-picker",
		required: true,
		fieldProps: {
			type: "date",
			format: "YYYY-MM-DD",
			"value-format": "YYYY-MM-DD",
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: communityOptions.statuses,
		required: true,
	},
	]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() =>
	plusFormColumns.value.map(column => ({
		...column,
		disabled: props.mode === "info",
	}))
);

/** 表单校验规则 */
const plusFormRules = computed(() => {
	if (props.mode === "info") {
		return {};
	}
	return {
		province: [{ required: true, message: "请选择省份", trigger: "change" }],
		city: [{ required: true, message: "请输入城市", trigger: "blur" }],
		district: [{ required: true, message: "请输入区县", trigger: "blur" }],
		name: [{ required: true, message: "请输入小区名称", trigger: "blur" }],
		code: [{ required: true, message: "请输入小区编码", trigger: "blur" }],
		servicePhone: [
			{ required: true, message: "请输入客服电话", trigger: "blur" },
			{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
		],
		area: [{ required: true, message: "请输入小区面积", trigger: "blur" }],
		startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
		endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
		status: [{ required: true, message: "请选择状态", trigger: "change" }],
	};
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
