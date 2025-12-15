<!--
  刷新缓存表单
  用于新增、修改刷新缓存配置
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import {
	RefreshCacheFormProps,
	RefreshCacheFormVO,
	defaultForm,
	cacheTypeOptions,
	refreshPolicyOptions,
	cacheStatusOptions,
} from "./form";

const props = defineProps<RefreshCacheFormProps>();

/** 默认的表单重置变量 Default values for form reset */
const defaultValues = props.defaultValues as FieldValues & RefreshCacheFormVO;

/** 表单组件实例 Form component instance */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/**
 * 本表单组件实际使用的表单对象
 * @description Actual form object used by this component
 */
const toRefForm = cloneDeep(props.form) as FieldValues & RefreshCacheFormVO;

/** 表单对象 Form object */
const form = ref(toRefForm);

/** 只读的表单对象 Readonly form object */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 Form columns configuration */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "缓存名称",
		prop: "cacheName",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入缓存名称",
		},
	},
	{
		label: "缓存键名",
		prop: "cacheKey",
		valueType: "input",
		required: true,
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入缓存键名，如 user:info:{id}",
		},
	},
	{
		label: "缓存类型",
		prop: "cacheType",
		valueType: "select",
		required: true,
		width: "160px",
		options: cacheTypeOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择缓存类型",
		},
	},
	{
		label: "缓存分组",
		prop: "cacheGroup",
		valueType: "input",
		required: true,
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入缓存分组，如 user, order, product",
		},
	},
	{
		label: "过期时间",
		prop: "expireTime",
		valueType: "input-number",
		required: true,
		width: "160px",
		fieldProps: {
			min: 1,
			max: 86400 * 30,
			controlsPosition: "right",
			placeholder: "秒",
		},
	},
	{
		label: "缓存描述",
		prop: "description",
		valueType: "textarea",
		width: "300px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入缓存描述信息",
			rows: 3,
			maxlength: 200,
			showWordLimit: true,
		},
	},
	{
		label: "刷新策略",
		prop: "refreshPolicy",
		valueType: "select",
		required: true,
		width: "160px",
		options: refreshPolicyOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择刷新策略",
		},
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		required: true,
		width: "120px",
		options: cacheStatusOptions,
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},
]);

/** 表单项配置 动态计算 只读 Computed form columns */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 Form validation rules */
const plusFormRules = ref<PlusFormRules>({
	cacheName: [
		{ required: true, message: "请输入缓存名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	cacheKey: [
		{ required: true, message: "请输入缓存键名", trigger: "blur" },
		{ min: 3, max: 100, message: "长度在 3 到 100 个字符", trigger: "blur" },
		{
			pattern: /^[a-zA-Z0-9_:{}[\].-]+$/,
			message: "缓存键名只能包含字母、数字、下划线、冒号、大括号、中括号、点和横杠",
			trigger: "blur",
		},
	],
	cacheType: [{ required: true, message: "请选择缓存类型", trigger: "change" }],
	cacheGroup: [
		{ required: true, message: "请输入缓存分组", trigger: "blur" },
		{ min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" },
	],
	expireTime: [
		{ required: true, message: "请输入过期时间", trigger: "blur" },
		{ type: "number", min: 1, message: "过期时间必须大于0秒", trigger: "blur" },
	],
	refreshPolicy: [{ required: true, message: "请选择刷新策略", trigger: "change" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
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
