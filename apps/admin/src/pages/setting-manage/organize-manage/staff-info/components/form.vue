<!--
  员工信息表单
  用于新增/修改员工信息
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { staffGenderOptions, type StaffInfoFormVO } from "@01s-11comm/type";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { $t, transformI18n } from "@/plugins/i18n";
import { type StaffInfoFormProps } from "./form.ts";

const props = defineProps<StaffInfoFormProps>();
const { locale, withLocale } = useI18nConfig();

function renderI18n(message: string) {
	void locale.value;
	return transformI18n(message);
}

const defaultValues = props.defaultValues as FieldValues & StaffInfoFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & StaffInfoFormVO);
const formComputed = computed(() => form.value);

const genderKeyMap = {
	男: "male",
	女: "female",
	male: "male",
	female: "female",
} as const;

const translatedGenderOptions = withLocale(() =>
	staffGenderOptions.map((option) => {
		const normalizedValue = String(option.value) === "女" || String(option.value) === "female" ? "female" : "male";

		return {
			...option,
			value: normalizedValue,
			label: renderI18n(
				$t(
					`settingManage.organizeManage.staffInfo.form.options.gender.${genderKeyMap[String(option.value) as keyof typeof genderKeyMap]}`,
				),
			),
		};
	}),
);

const positionOptions = withLocale(() => [
	{ label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.positions.staff")), value: "普通员工" },
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.positions.departmentManager")),
		value: "部门经理",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.positions.deputyManager")),
		value: "部门副经理",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.positions.teamLeader")),
		value: "部门组长",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.positions.branchGeneralManager")),
		value: "分公司总经理",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.positions.branchDeputyGeneralManager")),
		value: "分公司副总经理",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.positions.generalManagerAssistant")),
		value: "总经理助理",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.positions.headquartersGeneralManager")),
		value: "总公司总经理",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.positions.headquartersDeputyGeneralManager")),
		value: "总公司副总经理",
	},
]);

const orgOptions = withLocale(() => [
	{ label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.top")), value: "中航物业1" },
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.finance")),
		value: "中航物业1/财务部",
	},
	{ label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.hr")), value: "中航物业1/人事部" },
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.engineering")),
		value: "中航物业1/工程部",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.security")),
		value: "中航物业1/安保部",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.service")),
		value: "中航物业1/客服部",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.cleaning")),
		value: "中航物业1/保洁部",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.greening")),
		value: "中航物业1/绿化部",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.administration")),
		value: "中航物业1/行政部",
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.form.options.orgs.external")),
		value: "中航物业1/物业1外实员部门",
	},
]);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.fields.name")),
		prop: "name",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.staffInfo.form.placeholders.name")),
			maxlength: 10,
			minlength: 2,
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.fields.gender")),
		prop: "gender",
		valueType: "select",
		options: translatedGenderOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.staffInfo.form.placeholders.gender")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.fields.position")),
		prop: "position",
		valueType: "select",
		options: positionOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.staffInfo.form.placeholders.position")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.fields.email")),
		prop: "email",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.staffInfo.form.placeholders.email")),
			type: "email",
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.fields.phone")),
		prop: "phone",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.staffInfo.form.placeholders.phone")),
			maxlength: 11,
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.fields.address")),
		prop: "address",
		valueType: "input",
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.staffInfo.form.placeholders.address")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.fields.orgName")),
		prop: "orgName",
		valueType: "select",
		options: orgOptions.value,
		fieldProps: {
			placeholder: renderI18n($t("settingManage.organizeManage.staffInfo.form.placeholders.orgName")),
		},
	},
	{
		label: renderI18n($t("settingManage.organizeManage.staffInfo.fields.avatar")),
		prop: "avatar",
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	name: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.staffInfo.form.validation.enterName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 10,
			message: renderI18n($t("settingManage.organizeManage.staffInfo.form.validation.nameLength")),
			trigger: "blur",
		},
	],
	gender: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.staffInfo.form.validation.selectGender")),
			trigger: "change",
		},
	],
	position: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.staffInfo.form.validation.selectPosition")),
			trigger: "change",
		},
	],
	email: [
		{
			type: "email",
			message: renderI18n($t("settingManage.organizeManage.staffInfo.form.validation.invalidEmail")),
			trigger: "blur",
		},
	],
	phone: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.staffInfo.form.validation.enterPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: renderI18n($t("settingManage.organizeManage.staffInfo.form.validation.invalidPhone")),
			trigger: "blur",
		},
	],
	address: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.staffInfo.form.validation.enterAddress")),
			trigger: "blur",
		},
	],
	orgName: [
		{
			required: true,
			message: renderI18n($t("settingManage.organizeManage.staffInfo.form.validation.selectOrgName")),
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
