<!--
  合同草稿表单
  用于新增、修改合同草稿
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { AddFormProps, 合同类型, 合同草稿表单_VO, defaultForm } from "./addForm";

const props = defineProps<AddFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 合同草稿表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 合同草稿表单_VO;

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

// 定义事件
const emit = defineEmits<{
	(e: "submit"): void;
	(e: "reset"): void;
	(e: "close"): void;
}>();

// 提交表单
const handleSubmit = async () => {
	const formInstance = plusFormInstance.value;
	if (!formInstance) return;

	// await formInstance.validate();
	emit("submit");
};

// 重置表单
const handleReset = () => {
	const formInstance = plusFormInstance.value;
	if (!formInstance) return;

	// formInstance.resetFields();
	emit("reset");
};

// 关闭表单
const handleClose = () => {
	emit("close");
};

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	// 合同基本信息
	{
		label: "合同名称",
		prop: "合同名称",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写合同名称",
		},
	},
	{
		label: "合同编号",
		prop: "合同编号",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写合同编号",
		},
	},
	{
		label: "合同类型",
		prop: "合同类型",
		valueType: "select",
		options: [
			{ label: "采购合同", value: "采购合同" },
			{ label: "销售合同", value: "销售合同" },
			{ label: "服务合同", value: "服务合同" },
			{ label: "租赁合同", value: "租赁合同" },
		],
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请选择合同类型",
		},
	},

	// 甲方信息
	{
		label: "甲方",
		prop: "甲方",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写甲方",
		},
	},
	{
		label: "甲方联系人",
		prop: "甲方联系人",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写甲方联系人",
		},
	},
	{
		label: "甲方联系电话",
		prop: "甲方联系电话",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写甲方联系电话",
		},
	},

	// 乙方信息
	{
		label: "乙方",
		prop: "乙方",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写乙方",
		},
	},
	{
		label: "乙方联系人",
		prop: "乙方联系人",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写乙方联系人",
		},
	},
	{
		label: "乙方联系电话",
		prop: "乙方联系电话",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写乙方联系电话",
		},
	},

	// 经办信息
	{
		label: "经办人",
		prop: "经办人",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写经办人",
		},
	},
	{
		label: "经办电话",
		prop: "经办电话",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "必填，请填写经办电话",
		},
	},
	{
		label: "合同金额",
		prop: "合同金额",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: "选填，请填写合同金额",
		},
	},

	// 时间信息
	{
		label: "开始时间",
		prop: "开始时间",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: "必填，请选择开始时间",
		},
		required: true,
		span: 8,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: "必填，请选择结束时间",
		},
		required: true,
		span: 8,
	},
	{
		label: "签订时间",
		prop: "签订时间",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: "必填，请选择签订时间",
		},
		required: true,
		span: 8,
	},

	// 说明
	{
		label: "说明",
		prop: "说明",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: "选填，请输入合同说明信息",
		},
		span: 24,
	},

	// 合同附件
	{
		label: "合同附件",
		prop: "合同附件",
		fieldProps: {
			action: "/api/upload",
			multiple: true,
			limit: 5,
			fileList: [],
			accept: ".pdf,.doc,.docx,.xls,.xlsx",
			tip: "支持上传PDF、Word、Excel文件，最多5个文件",
		},
		span: 24,
	},
]);

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
	<div class="form-container">
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			class="form-root"
			:has-footer="false"
			:default-values="defaultValues"
			:columns="plusFormColumnsComputed"
			:rules="plusFormRules"
			:grid="{ cols: 24 }"
		/>

		<div class="form-footer">
			<ElButton @click="handleClose">关闭</ElButton>
			<ElButton @click="handleReset">重置</ElButton>
			<ElButton type="primary" @click="handleSubmit">提交</ElButton>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.form-container {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
}

.form-root {
	flex: 1;
	overflow-y: auto;
}

.form-footer {
	display: flex;
	justify-content: flex-end;
	padding: 16px 0;
	gap: 12px;
	border-top: 1px solid #eee;
	margin-top: 16px;
}
</style>
