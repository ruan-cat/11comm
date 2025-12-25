<script lang="ts" setup>
import { useTemplateRef } from "vue";
import type { CommunityInformationFormVO } from "@01s-11comm/type";

import { type CommunityInformationFormProps } from "./form";

/** 表单组件 props */
const props = defineProps<CommunityInformationFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & CommunityInformationFormVO;

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

/** 表单重设 */
usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = cloneDeep(props.form) as FieldValues & CommunityInformationFormVO;

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
		label: "物业公司",
		prop: "propertyCompany",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入物业公司名称",
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
		label: "省份",
		prop: "province",
		valueType: "select",
		options: [
			{ label: "福建省", value: "福建省" },
			{ label: "浙江省", value: "浙江省" },
			{ label: "江苏省", value: "江苏省" },
			{ label: "广东省", value: "广东省" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择省份",
		},
	},
	{
		label: "城市",
		prop: "city",
		valueType: "select",
		options: [
			{ label: "福州市", value: "福州市" },
			{ label: "厦门市", value: "厦门市" },
			{ label: "漳州市", value: "漳州市" },
			{ label: "泉州市", value: "泉州市" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择城市",
		},
	},
	{
		label: "区县",
		prop: "district",
		valueType: "select",
		options: [
			{ label: "仓山区", value: "仓山区" },
			{ label: "鼓楼区", value: "鼓楼区" },
			{ label: "台江区", value: "台江区" },
			{ label: "晋安区", value: "晋安区" },
			{ label: "马尾区", value: "马尾区" },
			{ label: "长乐区", value: "长乐区" },
			{ label: "闽侯县", value: "闽侯县" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择区县",
		},
	},
	{
		label: "详细地址",
		prop: "detailedAddress",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入详细地址",
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
		label: "管理员",
		prop: "administrator",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入管理员姓名",
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: [
			{ label: "正常运营", value: "正常运营" },
			{ label: "暂停运营", value: "暂停运营" },
			{ label: "装修中", value: "装修中" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},
	{
		label: "社区编码",
		prop: "communityCode",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入社区编码",
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
		label: "创建时间",
		prop: "createTime",
		valueType: "input",
		fieldProps: {
			clearable: true,
			placeholder: "请输入创建时间",
		},
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	communityName: [
		{ required: true, message: "请输入小区名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	propertyCompany: [
		{ required: true, message: "请输入物业公司名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	province: [{ required: true, message: "请选择省份", trigger: "change" }],
	city: [{ required: true, message: "请选择城市", trigger: "change" }],
	district: [{ required: true, message: "请选择区县", trigger: "change" }],
	detailedAddress: [
		{ required: true, message: "请输入详细地址", trigger: "blur" },
		{ min: 5, max: 100, message: "长度在 5 到 100 个字符", trigger: "blur" },
	],
	contactPhone: [
		{ required: true, message: "请输入联系电话", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	administrator: [
		{ required: true, message: "请输入管理员姓名", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
	],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

/** 默认对外导出 */
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
