<script lang="ts" setup>
import { useTemplateRef, computed, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { FieldValues, PlusColumn, PlusFormRules } from "plus-pro-components";
import { usePlusFormReset } from "@/composables/use-plus-form-reset";

import { type SchedulingSettingFormProps, type SchedulingSettingFormVO } from "./form";
import { schedulingTypeOptions, schedulingStatusOptions } from "@01s-11comm/type";

const props = defineProps<SchedulingSettingFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & SchedulingSettingFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & SchedulingSettingFormVO;

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
		label: "班次名称",
		prop: "name",
		valueType: "input",
	},
	{
		label: "排班类型",
		prop: "type",
		valueType: "select",
		options: schedulingTypeOptions,
	},
	{
		label: "排班周期",
		prop: "cycle",
		valueType: "input-number",
		fieldProps: {
			min: 1,
		},
	},
	{
		label: "生效时间",
		prop: "effectiveTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: "人员",
		prop: "staff",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: schedulingStatusOptions,
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	name: [{ required: true, message: "请输入班次名称", trigger: "blur" }],
	type: [{ required: true, message: "请选择排班类型", trigger: "change" }],
	cycle: [
		{ required: true, message: "请输入排班周期", trigger: "blur" },
		{ type: "number", min: 1, message: "排班周期必须大于0", trigger: "blur" },
	],
	effectiveTime: [{ required: true, message: "请选择生效时间", trigger: "change" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

/** 对外导出 */
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
