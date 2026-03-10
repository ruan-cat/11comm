<script lang="ts" setup>
import { useTemplateRef } from "vue";
import { OrganizationInfoFormProps, defaultForm } from "./form";
import { organizationTypeOptions, type OrganizationInfoFormVO } from "@01s-11comm/type";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

const props = defineProps<OrganizationInfoFormProps>();
const { t } = useI18n();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & OrganizationInfoFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & OrganizationInfoFormVO;

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

const translatedOrganizationTypeOptions = computed(() =>
	organizationTypeOptions.map((option) => ({
		...option,
		label: transformI18n(t(`settingManage.organizeManage.orgInfo.form.options.${option.value}`)),
	})),
);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n(t("settingManage.organizeManage.orgInfo.fields.name")),
		prop: "name",
		valueType: "input",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.orgInfo.fields.type")),
		prop: "type",
		valueType: "select",
		options: translatedOrganizationTypeOptions.value,
	},
	{
		label: transformI18n(t("settingManage.organizeManage.orgInfo.fields.code")),
		prop: "code",
		valueType: "input",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.orgInfo.fields.leaderName")),
		prop: "leaderName",
		valueType: "input",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.orgInfo.fields.phone")),
		prop: "phone",
		valueType: "input",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.orgInfo.fields.description")),
		prop: "description",
		valueType: "textarea",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.orgInfo.fields.enabled")),
		prop: "enabled",
		valueType: "switch",
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.orgInfo.form.validation.enterName")),
			trigger: "blur",
		},
	],
	type: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.orgInfo.form.validation.selectType")),
			trigger: "change",
		},
	],
	code: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.orgInfo.form.validation.enterCode")),
			trigger: "blur",
		},
	],
	leaderName: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.orgInfo.form.validation.enterLeaderName")),
			trigger: "blur",
		},
	],
	phone: [
		{
			required: true,
			message: transformI18n(t("settingManage.organizeManage.orgInfo.form.validation.enterPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n(t("settingManage.organizeManage.orgInfo.form.validation.invalidPhone")),
			trigger: "blur",
		},
	],
}));

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
