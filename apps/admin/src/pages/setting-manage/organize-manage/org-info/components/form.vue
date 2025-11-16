<script lang="ts" setup>
import { useTemplateRef } from "vue";
import { OrganizationInfoFormProps, defaultForm, type 组织信息表单_VO } from "./form";

const props = defineProps<OrganizationInfoFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 组织信息表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 组织信息表单_VO;

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
		label: "组织名称",
		prop: "组织名称",
		valueType: "input",
	},
	{
		label: "组织类型",
		prop: "组织类型",
		valueType: "select",
		options: [
			{ label: "公司", value: "company" },
			{ label: "部门", value: "department" },
			{ label: "小组", value: "group" },
		],
	},
	{
		label: "组织编码",
		prop: "组织编码",
		valueType: "input",
	},
	{
		label: "负责人姓名",
		prop: "负责人姓名",
		valueType: "input",
	},
	{
		label: "联系电话",
		prop: "联系电话",
		valueType: "input",
	},
	{
		label: "组织描述",
		prop: "组织描述",
		valueType: "textarea",
	},
	{
		label: "是否启用",
		prop: "是否启用",
		valueType: "switch",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	组织名称: [{ required: true, message: "请输入组织名称", trigger: "blur" }],
	组织类型: [{ required: true, message: "请选择组织类型", trigger: "change" }],
	组织编码: [{ required: true, message: "请输入组织编码", trigger: "blur" }],
	负责人姓名: [{ required: true, message: "请输入负责人姓名", trigger: "blur" }],
	联系电话: [
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
