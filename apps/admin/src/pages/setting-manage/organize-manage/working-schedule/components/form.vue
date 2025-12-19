<script lang="ts" setup>
import { useTemplateRef, reactive, ref, computed } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import type { PlusFormRules } from "@/config/constant";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";

import { WorkingScheduleFormProps, type WorkingScheduleFormVO } from "./form";

const props = defineProps<WorkingScheduleFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & WorkingScheduleFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & WorkingScheduleFormVO;

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
		prop: "name",
		valueType: "input",
	},
	{
		label: "排班类型",
		prop: "type",
		valueType: "select",
		options: [
			{ label: "早班", value: "morning" },
			{ label: "中班", value: "afternoon" },
			{ label: "晚班", value: "evening" },
			{ label: "夜班", value: "night" },
			{ label: "全天", value: "全天" },
		],
	},
	{
		label: "开始时间",
		prop: "startTime",
		valueType: "time-picker",
	},
	{
		label: "结束时间",
		prop: "endTime",
		valueType: "time-picker",
	},
	{
		label: "星期几",
		prop: "weekday",
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
		prop: "managerName",
		valueType: "input",
	},
	{
		label: "联系电话",
		prop: "phone",
		valueType: "input",
	},
	{
		label: "排班描述",
		prop: "description",
		valueType: "textarea",
	},
	{
		label: "是否启用",
		prop: "enabled",
		valueType: "switch",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	name: [{ required: true, message: "请输入排班名称", trigger: "blur" }],
	type: [{ required: true, message: "请选择排班类型", trigger: "change" }],
	startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
	endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
	weekday: [{ required: true, message: "请选择星期几", trigger: "change" }],
	managerName: [{ required: true, message: "请输入负责人姓名", trigger: "blur" }],
	phone: [
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
