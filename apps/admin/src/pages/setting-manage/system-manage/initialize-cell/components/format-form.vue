<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { FormatFormProps, type FormatConfirmationFormVO } from "./format-form";

const props = defineProps<FormatFormProps>();
const { withLocale } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & FormatConfirmationFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & FormatConfirmationFormVO);
const formComputed = computed(() => form.value);

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("settingManage.systemManage.initializeCell.fields.developerPassword")),
		prop: "developerPassword",
		valueType: "input",
		fieldProps: {
			type: "password",
			placeholder: transformI18n($t("settingManage.systemManage.initializeCell.placeholders.developerPassword")),
			showPassword: true,
		},
		formItemProps: {
			required: true,
			rules: [
				{
					required: true,
					message: transformI18n($t("settingManage.systemManage.initializeCell.validation.developerPasswordRequired")),
					trigger: "blur",
				},
			],
		},
	},
]);

const plusFormRules = withLocale<PlusFormRules>(() => ({
	developerPassword: [
		{
			required: true,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.developerPasswordRequired")),
			trigger: "blur",
		},
		{
			min: 6,
			max: 50,
			message: transformI18n($t("settingManage.systemManage.initializeCell.validation.developerPasswordLength")),
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
	<section class="form-root">
		<div class="warning-text">
			<p class="warning-text__content">
				<span class="warning-text__icon">!</span>
				{{
					i18n.global.t($t("settingManage.systemManage.initializeCell.warningText"), {
						item: props.initItem,
						status: props.initStatus,
					})
				}}
			</p>
		</div>

		<PlusForm
			ref="plusFormRef"
			v-model="form"
			class="form-root"
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

.warning-text {
	margin-bottom: 20px;
}

.warning-text__content {
	color: #e74c3c;
	font-size: 14px;
	line-height: 1.6;
	margin-bottom: 20px;
}

.warning-text__icon {
	color: #e74c3c;
	margin-right: 4px;
}
</style>
