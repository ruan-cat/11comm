<!--
  员工信息表单
  用于新增 修改员工信息
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";

import { StaffInfoFormProps, 员工信息表单数据, defaultForm } from "./form.ts";

const props = defineProps<StaffInfoFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 员工信息表单数据;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 员工信息表单数据;

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
	// 员工名称
	{
		label: "员工名称",
		prop: "员工名称",
		valueType: "input",
		fieldProps: {
			placeholder: "请填写员工名称（2-10位）",
			maxlength: 10,
			minlength: 2,
		},
		formItemProps: {
			rules: [
				{ required: true, message: "请填写员工名称", trigger: "blur" },
				{ min: 2, max: 10, message: "员工名称长度为2-10位", trigger: "blur" },
			],
		},
		required: true,
	},

	// 员工性别
	{
		label: "员工性别",
		prop: "员工性别",
		valueType: "select",
		options: [
			{ label: "男", value: "男" },
			{ label: "女", value: "女" },
		],
		fieldProps: {
			placeholder: "请选择员工性别",
		},
		required: true,
	},

	// 员工岗位
	{
		label: "员工岗位",
		prop: "员工岗位",
		valueType: "select",
		options: [
			{ label: "普通员工", value: "普通员工" },
			{ label: "部门经理", value: "部门经理" },
			{ label: "部门副经理", value: "部门副经理" },
			{ label: "部门组长", value: "部门组长" },
			{ label: "分公司总经理", value: "分公司总经理" },
			{ label: "分公司副总经理", value: "分公司副总经理" },
			{ label: "总经理助理", value: "总经理助理" },
			{ label: "总公司总经理", value: "总公司总经理" },
			{ label: "总公司副总经理", value: "总公司副总经理" },
		],
		fieldProps: {
			placeholder: "请选择岗位",
		},
		required: true,
	},

	// 员工邮箱
	{
		label: "员工邮箱",
		prop: "员工邮箱",
		valueType: "input",
		fieldProps: {
			placeholder: "请填写员工邮箱",
			type: "email",
		},
		formItemProps: {
			rules: [
				{
					type: "email",
					message: "请输入正确的邮箱格式",
					trigger: "blur",
				},
			],
		},
	},

	// 手机
	{
		label: "手机",
		prop: "手机",
		valueType: "input",
		fieldProps: {
			placeholder: "请填写手机",
			maxlength: 11,
		},
		formItemProps: {
			rules: [
				{ required: true, message: "请填写手机", trigger: "blur" },
				{
					pattern: /^1[3-9]\d{9}$/,
					message: "请输入正确的手机号格式",
					trigger: "blur",
				},
			],
		},
		required: true,
	},

	// 家庭住址
	{
		label: "家庭住址",
		prop: "家庭住址",
		valueType: "input",
		fieldProps: {
			placeholder: "请填写家庭住址",
		},
		required: true,
	},

	// 关联组织
	{
		label: "关联组织",
		prop: "关联组织",
		valueType: "select",
		options: [
			{ label: "中航物业1", value: "中航物业1" },
			{ label: "中航物业1/财务部", value: "中航物业1/财务部" },
			{ label: "中航物业1/人事部", value: "中航物业1/人事部" },
			{ label: "中航物业1/工程部", value: "中航物业1/工程部" },
			{ label: "中航物业1/安保部", value: "中航物业1/安保部" },
			{ label: "中航物业1/客服部", value: "中航物业1/客服部" },
			{ label: "中航物业1/保洁部", value: "中航物业1/保洁部" },
			{ label: "中航物业1/绿化部", value: "中航物业1/绿化部" },
			{ label: "中航物业1/行政部", value: "中航物业1/行政部" },
			{ label: "中航物业1/物业1外实员部门", value: "中航物业1/物业1外实员部门" },
		],
		fieldProps: {
			placeholder: "请选择关联组织",
		},
		required: true,
	},

	// 照片
	{
		label: "照片",
		prop: "照片",
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
	<PlusForm
		ref="plusFormRef"
		class="form-root"
		:has-footer="false"
		v-model="form"
		:default-values="defaultValues"
		:columns="plusFormColumnsComputed"
		:rules="plusFormRules"
		:row-props="{ gutter: 20 }"
		:col-props="{ span: 12 }"
		label-width="120px"
		label-position="right"
	>
		<!-- 照片上传插槽 -->
		<template #plus-field-照片>
			<div class="upload-container">
				<el-upload class="avatar-uploader" action="#" :show-file-list="false" :auto-upload="false" accept="image/*">
					<div class="upload-area">
						<el-icon class="upload-icon">
							<Plus />
						</el-icon>
					</div>
				</el-upload>
			</div>
		</template>
	</PlusForm>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}

.upload-container {
	.avatar-uploader {
		.upload-area {
			width: 120px;
			height: 120px;
			border: 2px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
			transition: border-color 0.3s;
			display: flex;
			align-items: center;
			justify-content: center;

			&:hover {
				border-color: #409eff;
			}

			.upload-icon {
				font-size: 28px;
				color: #8c939d;
			}
		}
	}
}
</style>
