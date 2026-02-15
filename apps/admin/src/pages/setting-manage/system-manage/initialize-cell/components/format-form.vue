<!--
 * 格式化确认表单
 * 用于确认格式化小区数据操作
-->
<script lang="ts" setup>
import { ref, computed } from "vue";
import { useTemplateRef } from "vue";
import { FormatFormProps, type FormatConfirmationFormVO } from "./format-form";

const props = defineProps<FormatFormProps>();

/**
 * 默认的表单重置变量
 */
const defaultValues = props.defaultValues as FieldValues & FormatConfirmationFormVO;

/**
 * 表单组件实例 要求对外直接导出本表单实例
 */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/**
 * 本表单组件 实际使用的表单对象
 * @description
 * 用强制类型转换 确保表单对象满足表单组件的类型要求
 *
 * 保守写法 重新克隆一个对象 避免直接修改外部传递的值
 */
const toRefForm = cloneDeep(props.form) as FieldValues & FormatConfirmationFormVO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(toRefForm);

/**
 * 只读的表单对象 用于外部做判断
 */
const formComputed = computed(() => {
	return form.value;
});

/**
 * 表单项配置
 */
const plusFormColumns = ref<PlusColumn[]>([
	{
		label: "开发者密码",
		prop: "developerPassword",
		valueType: "input",
		fieldProps: {
			type: "password",
			placeholder: "请输入开发者密码",
			showPassword: true,
		},
		formItemProps: {
			required: true,
			rules: [
				{
					required: true,
					message: "请输入开发者密码",
					trigger: "blur",
				},
			],
		},
	},
]);

/**
 * 表单项配置 动态计算 只读
 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/**
 * 表单校验
 */
const plusFormRules = ref<PlusFormRules>({
	developerPassword: [
		{ required: true, message: "请输入开发者密码", trigger: "blur" },
		{ min: 6, max: 50, message: "长度在 6 到 50 个字符", trigger: "blur" },
	],
});

defineExpose({
	plusFormInstance,
	formComputed,
});
</script>

<template>
	<section class="form-root">
		<!-- 警告提示 -->
		<div class="warning-text">
			<p style="color: #e74c3c; font-size: 14px; line-height: 1.6; margin-bottom: 20px">
				<span style="color: #e74c3c">• </span>
				请谨慎操作，此操作将处理初始化项目 <strong>【{{ props.initItem }}】</strong>，当前状态为
				<strong>【{{ props.initStatus }}】</strong> ，操作期间，请再次跟相关人员核实确认！
			</p>
		</div>

		<!-- 表单组件 -->
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			class="form-root"
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

	.warning-text {
		margin-bottom: 20px;
	}
}
</style>
