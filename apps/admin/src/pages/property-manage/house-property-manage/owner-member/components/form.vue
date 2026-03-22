<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { OwnerMemberFormVO } from "@01s-11comm/type";
import { genderOptions, memberTypeOptions } from "@01s-11comm/type";
import type { OwnerMemberFormProps } from "./form";

const props = defineProps<OwnerMemberFormProps>();
const { locale } = useI18nConfig();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OwnerMemberFormVO;

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
const form = ref(cloneDeep(props.form) as FieldValues & OwnerMemberFormVO);

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => {
	return form.value;
});

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 成员人脸
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.memberFace")),
		prop: "memberFace",
		valueType: "input",
	},

	// 名称
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.name")),
		prop: "name",
		valueType: "input",
		required: true,
	},

	// 性别
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.gender")),
		prop: "gender",
		valueType: "select",
		options: genderOptions,
		required: true,
	},

	// 类型
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.type")),
		prop: "type",
		valueType: "select",
		options: memberTypeOptions,
		required: true,
	},

	// 身份证
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.idCard")),
		prop: "idCard",
		valueType: "input",
		required: true,
	},

	// 联系方式
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.contact")),
		prop: "contact",
		valueType: "input",
		required: true,
	},

	// 家庭住址
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.homeAddress")),
		prop: "homeAddress",
		valueType: "input",
		required: true,
	},

	// 创建人
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.creator")),
		prop: "creator",
		valueType: "input",
	},

	// 备注
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.remark")),
		prop: "remark",
		valueType: "textarea",
		fieldProps: {
			rows: 3,
		},
	},

	// 门禁钥匙
	{
		label: transformI18n($t("property-manage_house-property-manage.owner-member.fields.accessKey")),
		prop: "accessKey",
		valueType: "select",
		options: [
			{ label: "有", value: "有" },
			{ label: "无", value: "无" },
		],
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-member.form.validation.enterName")),
			trigger: "blur",
		},
	],
	gender: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-member.form.validation.selectGender")),
			trigger: "change",
		},
	],
	type: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-member.form.validation.selectType")),
			trigger: "change",
		},
	],
	idCard: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-member.form.validation.enterIdCard")),
			trigger: "blur",
		},
	],
	contact: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-member.form.validation.enterContact")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_house-property-manage.owner-member.form.validation.contactPattern")),
			trigger: "blur",
		},
	],
	homeAddress: [
		{
			required: true,
			message: transformI18n($t("property-manage_house-property-manage.owner-member.form.validation.enterHomeAddress")),
			trigger: "blur",
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
		<PlusForm
			ref="plusFormRef"
			v-model="form"
			:has-footer="false"
			:default-values="defaultValues"
			:columns="plusFormColumns"
			:rules="plusFormRules"
			:label-width="90"
		/>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
