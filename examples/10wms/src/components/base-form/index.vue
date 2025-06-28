<script setup lang="ts" generic="T extends Record<string, any>">
import type { FormRules } from "element-plus";
import type { Ref } from "vue";
import type { _OmitFormProps, BaseFormItem } from "./types";
import ComponentsDinamicTableForm from "components/dinamic-table-form/index.vue";

import { cloneDeep, isNil } from "lodash-es";
import { defineEmits, defineProps, nextTick, useTemplateRef } from "vue";

/** 基础通用表单 props */
export interface BaseFormProps<T extends Record<string, any>>
/* @vue-ignore */
	extends _OmitFormProps {
	/**
	 * 表单对象
	 * @description
	 * 本组件主要服务的对象 该对象会被修改
	 */
	form: T;

	/**
	 * 表单字段配置
	 * @description
	 * 用于实现表单渲染的配置项 是本组件的核心配置项
	 * @version 2 类似于之前的 series 字段
	 */
	formItems: BaseFormItem<T>[];

	/**
	 * 业务意义上纯净的，被重置的表单原始值
	 * @description
	 * 重置表单时 如果提供了此表单对象 将会按照该对象来完成表单重置
	 *
	 * 比如搜索栏重置表单 ， 业务表单重置表单等等情况。
	 */
	beResetForm?: T;

	/**
	 * 校验规则
	 * @description
	 * 对于
	 */
	rules?: FormRules<T>;

	/**
	 * 不开启类似于表格样式的背景
	 * @description
	 * 增加背景色 增强业务表单的显示效果
	 * @default false
	 */
	isNotTableLikeBg?: boolean;
}

const props = defineProps<BaseFormProps<T>>();

/** @deprecated TODO: 暂不需要实现事件数据传递 */
const emits = defineEmits(["form-finish"]);

/** 被遍历的表单配置项 */
const formItems = computed(() => props.formItems);

/** 组件校验规则 */
const rules = computed(() => props.rules);

/**
 * 是否传递了 beResetForm 变量？
 * @description
 * 用来针对性的开启某些功能
 */
const hasBeResetForm = computed(() => !isNil(props.beResetForm));

/** 表单组件示例 */
const formRef = useTemplateRef("formRef");

/** 表单对象 在本组件内预期被高频率修改 */
const form = ref<T>(props.form) as Ref<T>;

/**
 * 获取表单数据
 * @description
 * 让外部组件 直接获取本组件的表单数据
 *
 * TODO: 未来实现组件数据监听 对外暴露数据变更事件
 * @public
 */
function getForm() {
	return form.value;
}

/**
 * 得到数据表更之后的组件实例
 * @private
 */
async function getFormRef() {
	// 无条件地先等待数据变化 变化完毕后再从组件内使用函数做
	await nextTick();
	return formRef.value;
}

/**
 * 表单是否校验完毕？
 * @description
 * TODO: 未来对接 表格表单的内部校验配置
 *
 * 时间不够 先不做表格表单的场景考虑
 */
async function isValidatePass() {
	const formRef = await getFormRef();
	if (isNil(formRef)) {
		console.error("表单引用未找到");
		// 认定表单校验失败了。
		return false;
	}

	/**
	 * 整个表单的校验结果
	 * @default true 默认校验是通过的
	 */
	let validateRes = true;

	await formRef.validate((valid, fields) => {
		// 只要出现任何一个字段校验失败 就认定为整个表单都校验失败了
		if (!valid) {
			// TODO: 未来实现表单校验失败的提示 将错误的 fields 显示出来
			// TODO: 实现错误字段的滚动定位 或者是错误项的高亮
			validateRes = false;
		}
	});

	return validateRes;
}

/**
 * 提交
 * @description
 * 认定是表单提交 只负责返回本组件的form数据
 *
 * 1. 先做表单校验
 * 2. 然后再对外返回经过校验的数据
 *
 * 不会做有意义的接口请求 本组件不负责和业务直接关联的异步请求
 * @public
 */
async function submit() {
	const formRef = await getFormRef();
	if (!isNil(formRef)) {
		const validateRes = await isValidatePass();
		if (validateRes) {
			return getForm();
		}
	}
}

/**
 * 重置表单
 * @description
 * 用的是组件库内部的重置能力 重置不等于清空表单
 * @public
 */
async function resetForm() {
	/**
	 * 如果外部提供了专用于重置表单的值 那么重置表单就用外部传递的值实现
	 * 这里的写法实际上是冗余的 仅仅是为了通过typescript类型约束移除掉不存在的值罢了
	 */
	if (hasBeResetForm.value && props.beResetForm) {
		form.value = cloneDeep(props.beResetForm);
		return;
	}

	const formRef = await getFormRef();
	if (!isNil(formRef)) {
		formRef.resetFields();
	}
}

defineExpose({
	getForm,
	submit,
	resetForm,
});
</script>

<template>
	<ElForm
		class="dynamic-form"
		:class="{ 'table-like-bg': !props.isNotTableLikeBg }"
		:="{ ...$attrs, ...props }"
		:model="form"
		:rules="rules"
		label-suffix=":"
		ref="formRef"
		@submit.prevent
	>
		<ElRow :gutter="20">
			<template v-for="(formItem, index) in formItems" :key="index">
				<!-- 
					表格类型特殊处理
					其表单项的布局是固定写死为top的，否则展示效果很差
				-->
				<template v-if="formItem.type === 'table'">
					<ElCol :span="24">
						<ElFormItem :label="formItem.props.label" label-position="top">
							<!-- <div class="table-title">{{ label }}</div> -->
							<ComponentsDinamicTableForm :="formItem.props" />
						</ElFormItem>
					</ElCol>
				</template>

				<!-- 常规表单项 -->
				<ElCol
					v-else
					:span="formItem.props.responsive?.xs || 24"
					:sm="formItem.props.responsive?.sm"
					:md="formItem.props.responsive?.md || 12"
					:lg="formItem.props.responsive?.lg || 8"
					:xl="formItem.props.responsive?.xl"
				>
					<ElFormItem :label="formItem.props.label" :prop="formItem.props.prop">
						<!-- 输入框 -->
						<ElInput v-if="formItem.type === 'input'" v-model="form[formItem.props.prop]" :="formItem.props" />

						<!-- 选择器 -->
						<ElSelect v-else-if="formItem.type === 'select'" v-model="form[formItem.props.prop]">
							<ElOption
								v-for="(option, i) in formItem.props.options"
								:key="i"
								:label="option.label"
								:value="option.value"
							/>
						</ElSelect>

						<!-- 日期选择 -->
						<ElDatePicker
							v-else-if="formItem.type === 'date'"
							v-model="form[formItem.props.prop]"
							:type="formItem.props.type"
							:placeholder="formItem.props.placeholder"
							:format="formItem.props.format"
							:value-format="formItem.props.valueFormat"
						/>

						<!-- 数字输入 -->
						<ElInputNumber
							v-else-if="formItem.type === 'number'"
							v-model="form[formItem.props.prop]"
							:min="formItem.props.min"
							:max="formItem.props.max"
							:step="formItem.props.step"
							:precision="formItem.props.precision"
							controls-position="right"
						/>
					</ElFormItem>
				</ElCol>
			</template>
		</ElRow>
		<!-- 
			TODO: 纯粹的表单组件 不内置封装这些按钮 这些按钮在其他场景内完成
			在别的派生组件内封装该功能
		-->
		<!-- <ElButton @click="handleFinish">提交</ElButton>
		<ElButton @click="clearForm">重置</ElButton> -->
	</ElForm>
</template>

<style lang="scss">
.dynamic-form {
	--bs: 2px;
	--bsm: calc(var(--bs) * 0.5);
	--bc: #ebeef5;

	&.table-like-bg {
		.el-form-item {
			border: var(--bs) solid var(--bc);
			border-bottom: none;

			.el-form-item__label {
				color: #606266;
				background-color: #f5f7fa;
				border-right: var(--bs) solid var(--bc);
			}
		}

		.el-row .el-col {
			&:last-child {
				.el-form-item {
					border-bottom: var(--bs) solid var(--bc);
				}
			}
		}
	}

	.el-form-item {
		margin-bottom: 0;

		.el-form-item__label {
			font-weight: 500;
			margin-bottom: 0;
			min-height: 40px;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}

		.el-form-item__content {
			padding: 4px 12px;
			min-height: 40px;
			display: flex;
			align-items: center;
		}
	}

	.el-form-item {
		.el-form-item__label {
			font-weight: 500;
			color: #606266;
		}
	}

	.el-input,
	.el-select,
	.el-date-editor,
	.el-input-number {
		width: 100% !important;
	}

	.el-input-number {
		.el-input__wrapper {
			padding-left: 10px;
			padding-right: 10px;
		}
	}

	@media (max-width: 768px) {
		&.table-like-bg .el-form-item {
			margin-bottom: 0;
		}

		.el-form-item {
			margin-bottom: 12px;
		}
	}
}
</style>
