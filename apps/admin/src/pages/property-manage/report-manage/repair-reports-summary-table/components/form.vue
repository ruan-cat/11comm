<script lang="ts" setup>
import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type RepairReportsSummaryTableFormData, repairReportsSummaryTableFormRules } from "./form";
import { repairTypeOptions, repairStatusOptions, urgencyLevelOptions, communityOptions } from "@01s-11comm/type";

interface Props {
	/** 表单数据 */
	modelValue: RepairReportsSummaryTableFormData;
	/** 表单模式 */
	mode?: "add" | "edit" | "view";
	/** 是否显示 Dialog */
	dialogVisible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	mode: "add",
	dialogVisible: false,
});

interface Emits {
	(e: "update:modelValue", value: RepairReportsSummaryTableFormData): void;
	(e: "update:dialogVisible", value: boolean): void;
	(e: "submit"): void;
	(e: "reset"): void;
}

const emit = defineEmits<Emits>();

/** 表单数据双向绑定 */
const formData = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

/** Dialog 显示状态双向绑定 */
const dialogVisible = computed({
	get: () => props.dialogVisible,
	set: (value) => emit("update:dialogVisible", value),
});

/** 表单引用 */
const formRef = ref<FormInstance>();

/** 表单列配置 */
const columns = computed<PlusColumn[]>(() => [
	{
		label: "报修类型",
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
		span: 12,
	},
	{
		label: "报修状态",
		prop: "repairStatus",
		valueType: "select",
		options: repairStatusOptions,
		span: 12,
	},
	{
		label: "紧急程度",
		prop: "urgencyLevel",
		valueType: "select",
		options: urgencyLevelOptions,
		span: 12,
	},
	{
		label: "小区",
		prop: "community",
		valueType: "select",
		options: communityOptions,
		span: 12,
	},
	{
		label: "统计开始时间",
		prop: "statisticsStartTime",
		valueType: "date-picker",
		span: 12,
	},
	{
		label: "统计结束时间",
		prop: "statisticsEndTime",
		valueType: "date-picker",
		span: 12,
	},
]);

/** 表单配置 */
const formProps = computed<PlusFormProps>(() => ({
	rules: repairReportsSummaryTableFormRules,
	labelWidth: 140,
	labelPosition: "right",
	disabled: props.mode === "view",
}));

/** 提交表单 */
function handleSubmit() {
	if (!formRef.value) return;

	formRef.value.validate((valid) => {
		if (valid) {
			console.log("表单数据:", formData.value);
			emit("submit");
		}
	});
}

/** 重置表单 */
function handleReset() {
	if (!formRef.value) return;

	formRef.value.resetFields();
	emit("reset");
}

/** 关闭 Dialog */
function handleClose() {
	dialogVisible.value = false;
}
</script>

<template>
	<ElDialog
		v-model="dialogVisible"
		:title="transformI18n($t(`common.buttons.${mode}`))"
		width="800px"
		@close="handleClose"
	>
		<PlusForm ref="formRef" v-model="formData" :="formProps" :columns="columns" />

		<template #footer>
			<ElButton @click="handleClose">
				{{ transformI18n($t("common.buttons.cancel")) }}
			</ElButton>
			<ElButton v-if="mode !== 'view'" type="primary" @click="handleSubmit">
				{{ transformI18n($t("common.buttons.confirm")) }}
			</ElButton>
		</template>
	</ElDialog>
</template>
