<script lang="ts" setup>
import { useTemplateRef, reactive } from "vue";

import { WorkingScheduleFormProps, type 排班表表单_VO } from "./form";

const props = defineProps<WorkingScheduleFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 排班表表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 排班表表单_VO;

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
		label: "排班名称",
		prop: "排班名称",
		valueType: "input",
	},
	{
		label: "排班类型",
		prop: "排班类型",
		valueType: "select",
		options: [
			{ label: "早班", value: "morning" },
			{ label: "午班", value: "afternoon" },
			{ label: "夜班", value: "night" },
			{ label: "节假日", value: "holiday" },
			{ label: "加班", value: "overtime" },
		],
	},
	{
		label: "开始时间",
		prop: "开始时间",
		valueType: "time-picker",
	},
	{
		label: "结束时间",
		prop: "结束时间",
		valueType: "time-picker",
	},
	{
		label: "星期几",
		prop: "星期几",
		valueType: "select",
		options: [
			{ label: "星期一", value: 1 },
			{ label: "星期二", value: 2 },
			{ label: "星期三", value: 3 },
			{ label: "星期四", value: 4 },
			{ label: "星期五", value: 5 },
			{ label: "星期六", value: 6 },
			{ label: "星期日", value: 7 },
		],
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
		label: "排班描述",
		prop: "排班描述",
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
	排班名称: [{ required: true, message: "请输入排班名称", trigger: "blur" }],
	排班类型: [{ required: true, message: "请选择排班类型", trigger: "change" }],
	开始时间: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	结束时间: [{ required: true, message: "请选择结束时间", trigger: "change" }],
	星期几: [{ required: true, message: "请选择星期几", trigger: "change" }],
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
