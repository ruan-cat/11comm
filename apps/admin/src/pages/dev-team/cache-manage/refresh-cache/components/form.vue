<!--
  刷新缓存表单
  用于新增、修改刷新缓存配置
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";

import { RefreshCacheFormProps, 刷新缓存表单_VO, defaultForm } from "./form";

const props = defineProps<RefreshCacheFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 刷新缓存表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 刷新缓存表单_VO;

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
	// 缓存名称
	{
		label: "缓存名称",
		prop: "缓存名称",
		valueType: "input",
		required: true,
		width: "200px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入缓存名称",
		},
	},

	// 缓存键名
	{
		label: "缓存键名",
		prop: "缓存键名",
		valueType: "input",
		required: true,
		width: "220px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入缓存键名，如 user:info:{id}",
		},
	},

	// 缓存类型
	{
		label: "缓存类型",
		prop: "缓存类型",
		valueType: "select",
		required: true,
		width: "160px",
		options: [
			{ label: "Redis", value: "Redis" },
			{ label: "Memory", value: "Memory" },
			{ label: "Memcached", value: "Memcached" },
			{ label: "Ehcache", value: "Ehcache" },
			{ label: "Caffeine", value: "Caffeine" },
			{ label: "Guava Cache", value: "Guava Cache" },
			{ label: "Hazelcast", value: "Hazelcast" },
			{ label: "Infinispan", value: "Infinispan" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择缓存类型",
		},
	},

	// 缓存分组
	{
		label: "缓存分组",
		prop: "缓存分组",
		valueType: "input",
		required: true,
		width: "180px",
		fieldProps: {
			clearable: true,
			placeholder: "请输入缓存分组，如 user, order, product",
		},
	},

	// 过期时间
	{
		label: "过期时间",
		prop: "过期时间",
		valueType: "input-number",
		required: true,
		width: "160px",
		fieldProps: {
			min: 1,
			max: 86400 * 30, // 最大30天
			controlsPosition: "right",
			placeholder: "秒",
		},
	},

	// 缓存描述
	{
		label: "缓存描述",
		prop: "缓存描述",
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

	// 刷新策略
	{
		label: "刷新策略",
		prop: "刷新策略",
		valueType: "select",
		required: true,
		width: "160px",
		options: [
			{ label: "定时刷新", value: "定时刷新" },
			{ label: "手动刷新", value: "手动刷新" },
			{ label: "懒加载刷新", value: "懒加载刷新" },
			{ label: "事件触发刷新", value: "事件触发刷新" },
			{ label: "TTL过期刷新", value: "TTL过期刷新" },
			{ label: "LRU淘汰刷新", value: "LRU淘汰刷新" },
		],
		fieldProps: {
			clearable: true,
			filterable: true,
			placeholder: "请选择刷新策略",
		},
	},

	// 状态
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		required: true,
		width: "120px",
		options: [
			{ label: "启用", value: "启用" },
			{ label: "禁用", value: "禁用" },
			{ label: "维护中", value: "维护中" },
		],
		fieldProps: {
			clearable: true,
			placeholder: "请选择状态",
		},
	},
]);

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({
	缓存名称: [
		{ required: true, message: "请输入缓存名称", trigger: "blur" },
		{ min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
	],
	缓存键名: [
		{ required: true, message: "请输入缓存键名", trigger: "blur" },
		{ min: 3, max: 100, message: "长度在 3 到 100 个字符", trigger: "blur" },
		{
			pattern: /^[a-zA-Z0-9_:{}[\].-]+$/,
			message: "缓存键名只能包含字母、数字、下划线、冒号、大括号、中括号、点和横杠",
			trigger: "blur",
		},
	],
	缓存类型: [{ required: true, message: "请选择缓存类型", trigger: "change" }],
	缓存分组: [
		{ required: true, message: "请输入缓存分组", trigger: "blur" },
		{ min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" },
	],
	过期时间: [
		{ required: true, message: "请输入过期时间", trigger: "blur" },
		{ type: "number", min: 1, message: "过期时间必须大于0秒", trigger: "blur" },
	],
	刷新策略: [{ required: true, message: "请选择刷新策略", trigger: "change" }],
	状态: [{ required: true, message: "请选择状态", trigger: "change" }],
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