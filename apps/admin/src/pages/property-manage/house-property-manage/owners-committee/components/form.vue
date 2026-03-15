<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";

import type { OwnersCommitteeFormProps } from "./form";
import type { OwnersCommitteeFormVO } from "@01s-11comm/type";
import { genderOptions, ownersCommitteeStatusOptions } from "@01s-11comm/type";

const props = defineProps<OwnersCommitteeFormProps>();
const { locale, computed } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OwnersCommitteeFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & OwnersCommitteeFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => form.value);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 姓名
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.fullName")),
		prop: "fullName",
		valueType: "input",
		required: true,
	},

	// 性别
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.gender")),
		prop: "gender",
		valueType: "select",
		options: genderOptions,
		required: true,
	},

	// 电话
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.phone")),
		prop: "phone",
		valueType: "input",
		required: true,
	},

	// 身份证号码
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.idNumber")),
		prop: "idNumber",
		valueType: "input",
		required: true,
	},
	// 住址
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.address")),
		prop: "address",
		valueType: "input",
		required: true,
	},
	// 职位
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.position")),
		prop: "position",
		valueType: "input",
		required: true,
	},
	// 岗位
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.post")),
		prop: "post",
		valueType: "input",
		required: true,
	},
	// 岗位描述
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.postDescription")),
		prop: "postDescription",
		valueType: "input",
	},
	// 届期
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.term")),
		prop: "term",
		valueType: "input",
		required: true,
	},
	// 任期
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.tenure")),
		prop: "tenure",
		valueType: "input",
		required: true,
	},
	// 状态
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.status")),
		prop: "status",
		valueType: "select",
		options: ownersCommitteeStatusOptions,
		required: true,
	},
	// 备注
	{
		label: transformI18n($t("property-manage_house-property-manage.owners-committee.fields.remark")),
		prop: "remark",
		valueType: "textarea",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	fullName: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.owners-committee.form.validation.enterFullName"),
			),
			trigger: "blur",
		},
	],
	gender: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owners-committee.form.validation.selectGender")),
			trigger: "change",
		},
	],
	phone: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owners-committee.form.validation.enterPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_house-property-manage.owners-committee.form.validation.phonePattern")),
			trigger: "blur",
		},
	],
	idNumber: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.owners-committee.form.validation.enterIdNumber"),
			),
			trigger: "blur",
		},
		{
			pattern: /^\d{17}[\dXx]$/,
			message: transformI18n(
				$t("property-manage_house-property-manage.owners-committee.form.validation.idNumberPattern"),
			),
			trigger: "blur",
		},
	],
	address: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owners-committee.form.validation.enterAddress")),
			trigger: "blur",
		},
	],
	position: [
		{
			required: true,
			message: transformI18n(
				$t("property-manage_house-property-manage.owners-committee.form.validation.enterPosition"),
			),
			trigger: "blur",
		},
	],
	post: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owners-committee.form.validation.enterPost")),
			trigger: "blur",
		},
	],
	term: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owners-committee.form.validation.enterTerm")),
			trigger: "blur",
		},
	],
	tenure: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owners-committee.form.validation.enterTenure")),
			trigger: "blur",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owners-committee.form.validation.selectStatus")),
			trigger: "change",
		},
	],
}));

defineExpose({
	plusFormInstance,
	formComputed,
});
</script>

<template>
	<section :key="locale" class="form-root">
		<!-- 需要配置分组表单，一旦配置分组表单，columns将会失效
	    1.配置两列：
	      :row-props="{ gutter: 20 }"
	      :col-props="{
	        span: 12, //24/12=2列
	      }"
	    2.为了"身份证号码"label好看点，配置label宽度：
	      :label-width="100"
	  -->
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			:has-footer="false"
			:default-values="defaultValues"
			:columns="plusFormColumns"
			:rules="plusFormRules"
			:row-props="{ gutter: 20 }"
			:col-props="{
				span: 12, //24/12=2列
			}"
			:label-width="100"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
