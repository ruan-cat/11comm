<!--
  员工信息表单
  用于新增 修改员工信息
-->
<script lang="ts" setup>
import { ref, computed, useTemplateRef } from "vue";
import { staffGenderOptions, type StaffInfoFormVO } from "@01s-11comm/type";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";

import { type StaffInfoFormProps } from "./form.ts";

const props = defineProps<StaffInfoFormProps>();
const { t } = useI18n();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & StaffInfoFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & StaffInfoFormVO;

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

const translatedGenderOptions = computed(() => {
	const genderKeyMap: Record<string, string> = {
		男: "male",
		女: "female",
	};

	return staffGenderOptions.map((option) => ({
		...option,
		label: transformI18n(
			t(`settingManage.organizeManage.staffInfo.form.options.gender.${genderKeyMap[String(option.value)]}`),
		),
	}));
});

const positionOptions = computed(() => [
	{ label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.positions.staff")), value: "普通员工" },
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.positions.departmentManager")),
		value: "部门经理",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.positions.deputyManager")),
		value: "部门副经理",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.positions.teamLeader")),
		value: "部门组长",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.positions.branchGeneralManager")),
		value: "分公司总经理",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.positions.branchDeputyGeneralManager")),
		value: "分公司副总经理",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.positions.generalManagerAssistant")),
		value: "总经理助理",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.positions.headquartersGeneralManager")),
		value: "总公司总经理",
	},
	{
		label: transformI18n(
			t("settingManage.organizeManage.staffInfo.form.options.positions.headquartersDeputyGeneralManager"),
		),
		value: "总公司副总经理",
	},
]);

const orgOptions = computed(() => [
	{ label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.top")), value: "中航物业1" },
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.finance")),
		value: "中航物业1/财务部",
	},
	{ label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.hr")), value: "中航物业1/人事部" },
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.engineering")),
		value: "中航物业1/工程部",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.security")),
		value: "中航物业1/安保部",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.service")),
		value: "中航物业1/客服部",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.cleaning")),
		value: "中航物业1/保洁部",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.greening")),
		value: "中航物业1/绿化部",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.administration")),
		value: "中航物业1/行政部",
	},
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.form.options.orgs.external")),
		value: "中航物业1/物业1外实员部门",
	},
]);

/** 表单项配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 员工名称
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(t("settingManage.organizeManage.staffInfo.form.placeholders.name")),
			maxlength: 10,
			minlength: 2,
		},
		formItemProps: {
			rules: [
				{
					required: true,
					message: transformI18n(t("settingManage.organizeManage.staffInfo.form.validation.enterName")),
					trigger: "blur",
				},
				{
					min: 2,
					max: 10,
					message: transformI18n(t("settingManage.organizeManage.staffInfo.form.validation.nameLength")),
					trigger: "blur",
				},
			],
		},
		required: true,
	},

	// 员工性别
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.fields.gender")),
		prop: "gender",
		valueType: "select",
		options: translatedGenderOptions.value,
		fieldProps: {
			placeholder: transformI18n(t("settingManage.organizeManage.staffInfo.form.placeholders.gender")),
		},
		required: true,
	},

	// 员工岗位
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.fields.position")),
		prop: "position",
		valueType: "select",
		options: positionOptions.value,
		fieldProps: {
			placeholder: transformI18n(t("settingManage.organizeManage.staffInfo.form.placeholders.position")),
		},
		required: true,
	},

	// 员工邮箱
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.fields.email")),
		prop: "email",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(t("settingManage.organizeManage.staffInfo.form.placeholders.email")),
			type: "email",
		},
		formItemProps: {
			rules: [
				{
					type: "email",
					message: transformI18n(t("settingManage.organizeManage.staffInfo.form.validation.invalidEmail")),
					trigger: "blur",
				},
			],
		},
	},

	// 手机
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.fields.phone")),
		prop: "phone",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(t("settingManage.organizeManage.staffInfo.form.placeholders.phone")),
			maxlength: 11,
		},
		formItemProps: {
			rules: [
				{
					required: true,
					message: transformI18n(t("settingManage.organizeManage.staffInfo.form.validation.enterPhone")),
					trigger: "blur",
				},
				{
					pattern: /^1[3-9]\d{9}$/,
					message: transformI18n(t("settingManage.organizeManage.staffInfo.form.validation.invalidPhone")),
					trigger: "blur",
				},
			],
		},
		required: true,
	},

	// 家庭住址
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.fields.address")),
		prop: "address",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n(t("settingManage.organizeManage.staffInfo.form.placeholders.address")),
		},
		formItemProps: {
			rules: [
				{
					required: true,
					message: transformI18n(t("settingManage.organizeManage.staffInfo.form.validation.enterAddress")),
					trigger: "blur",
				},
			],
		},
		required: true,
	},

	// 关联组织
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.fields.orgName")),
		prop: "orgName",
		valueType: "select",
		options: orgOptions.value,
		fieldProps: {
			placeholder: transformI18n(t("settingManage.organizeManage.staffInfo.form.placeholders.orgName")),
		},
		formItemProps: {
			rules: [
				{
					required: true,
					message: transformI18n(t("settingManage.organizeManage.staffInfo.form.validation.selectOrgName")),
					trigger: "change",
				},
			],
		},
		required: true,
	},

	// 照片
	{
		label: transformI18n(t("settingManage.organizeManage.staffInfo.fields.avatar")),
		prop: "avatar",
	},
]);

/** 表单校验规则 */
const plusFormRules = ref<PlusFormRules>({});

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
			<template #plus-field-avatar>
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
	</section>
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
