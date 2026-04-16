<!--
  合同草稿表单
  用于新增和编辑合同草稿
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import {
	attachmentTypeOptions,
	contractTypeOptions,
	type AttachmentDetailItem,
	type AttachmentMetaInput,
	type ContractDraftFormVO,
} from "@01s-11comm/type";
import type { ContractDraftFormProps } from "./form";
import ContractDraftUpload from "./upload.vue";
import type { ResumableUploadAttachmentTypeOption } from "../../shared-upload/types";

const props = defineProps<ContractDraftFormProps>();

/** 表单默认值 */
const defaultValues = props.defaultValues as FieldValues & ContractDraftFormVO;

/** 表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");

usePlusFormReset(plusFormInstance);

/** 表单响应式数据 */
const form = ref(cloneDeep(props.form) as FieldValues & ContractDraftFormVO);

/** 对外暴露的表单值 */
const formComputed = computed(() => form.value);

const uploadRef = ref<{
	reset: () => void;
	getHasBlockingUpload: () => boolean;
} | null>(null);
const draftContractFormMessageKeys = {
	restoreAttachment: "property-manage_contract-manage.draft-contract.actions.restoreAttachment",
	removeAttachment: "property-manage_contract-manage.draft-contract.actions.removeAttachment",
} as const;

const uploadRenderKey = ref(0);
const removedAttachmentIds = ref<string[]>([]);

/** 已有附件列表 */
const existingAttachments = computed(() => props.detailAttachments ?? []);

/** 当前保留的附件 */
const editableAttachments = computed(() => {
	return existingAttachments.value.filter((item) => !removedAttachmentIds.value.includes(item.id));
});

/** 是否还有未完成上传 */
const hasBlockingUpload = computed(() => uploadRef.value?.getHasBlockingUpload() ?? false);
const uploadAttachmentTypeOptions = attachmentTypeOptions as ResumableUploadAttachmentTypeOption[];

/** 表单列配置 */
const plusFormColumns = computed<PlusColumn[]>(() => [
	// 合同基本信息
	{
		/** @description 合同名称 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractName")),
		prop: "contractName",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.contractName")),
		},
	},
	{
		/** @description 合同编号 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractNumber")),
		prop: "contractNumber",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.contractNumber")),
		},
	},
	{
		/** @description 合同类型 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractType")),
		prop: "contractType",
		valueType: "select",
		options: contractTypeOptions,
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.contractType")),
		},
	},

	// 甲方信息
	{
		/** @description 甲方 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyA")),
		prop: "partyA",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyA")),
		},
	},
	{
		/** @description 甲方联系人 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyAContact")),
		prop: "partyAContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyAContact")),
		},
	},
	{
		/** @description 甲方电话 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyAPhone")),
		prop: "partyAPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyAPhone")),
		},
	},

	// 乙方信息
	{
		/** @description 乙方 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyB")),
		prop: "partyB",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyB")),
		},
	},
	{
		/** @description 乙方联系人 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyBContact")),
		prop: "partyBContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyBContact")),
		},
	},
	{
		/** @description 乙方电话 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.partyBPhone")),
		prop: "partyBPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.partyBPhone")),
		},
	},

	// 经办信息
	{
		/** @description 经办人 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.handler")),
		prop: "handler",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.handler")),
		},
	},
	{
		/** @description 经办电话 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.handlerPhone")),
		prop: "handlerPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.handlerPhone")),
		},
	},
	{
		/** @description 合同金额 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.contractAmount")),
		prop: "contractAmount",
		valueType: "input-number",
		required: false,
		span: 8,
		fieldProps: {
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.contractAmount")),
			precision: 2,
			min: 0,
		},
	},

	// 时间信息
	{
		/** @description 开始时间 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.startTime")),
		},
		required: true,
		span: 8,
	},
	{
		/** @description 结束时间 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.endTime")),
		},
		required: true,
		span: 8,
	},
	{
		/** @description 签订时间 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.signingTime")),
		prop: "signingTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.signingTime")),
		},
		required: true,
		span: 8,
	},

	// 补充说明
	{
		/** @description 说明 */
		label: transformI18n($t("property-manage_contract-manage.draft-contract.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: {
			rows: 4,
			placeholder: transformI18n($t("property-manage_contract-manage.draft-contract.form.placeholders.description")),
		},
		span: 24,
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	contractName: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractNameLength")),
			trigger: "blur",
		},
	],
	contractNumber: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractNumber")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 30,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractNumberLength")),
			trigger: "blur",
		},
	],
	contractType: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.contractType")),
			trigger: "change",
		},
	],
	partyA: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyA")),
			trigger: "blur",
		},
	],
	partyAContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyAContact")),
			trigger: "blur",
		},
	],
	partyAPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyAPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	partyB: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyB")),
			trigger: "blur",
		},
	],
	partyBContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyBContact")),
			trigger: "blur",
		},
	],
	partyBPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.partyBPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	handler: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.handler")),
			trigger: "blur",
		},
	],
	handlerPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.handlerPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.startTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.endTime")),
			trigger: "change",
		},
	],
	signingTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.draft-contract.form.validation.signingTime")),
			trigger: "change",
		},
	],
}));

/**
 * 切换既有附件的删除态。
 * @description
 * 历史附件不会直接从表单里移除，而是通过维护删除 ID 集合来表达“提交时删除/恢复”的意图。
 */
function toggleExistingAttachment(item: AttachmentDetailItem) {
	const exists = removedAttachmentIds.value.includes(item.id);
	removedAttachmentIds.value = exists
		? removedAttachmentIds.value.filter((current) => current !== item.id)
		: [...removedAttachmentIds.value, item.id];
}

/**
 * 重置附件上传区状态。
 * @description
 * 关闭或重置表单时，除了恢复已删除附件标记，还需要重建上传子组件以清空内部续传队列状态。
 */
function resetUploadState() {
	removedAttachmentIds.value = [];
	uploadRenderKey.value += 1;
	uploadRef.value?.reset?.();
}

/**
 * 汇总附件提交状态。
 * @description
 * 将新上传附件、保留附件和删除附件三类信息整理成接口所需的 payload 片段。
 */
function getAttachmentSubmitState() {
	const completedAttachments = form.value.attachments ?? [];
	const newUploadSessionIds = Array.from(
		new Set(completedAttachments.map((item) => item.uploadSessionId).filter((item): item is string => Boolean(item))),
	);

	const attachmentMetas: AttachmentMetaInput[] = completedAttachments
		.filter((item) => Boolean(item.uploadSessionId))
		.map((item) => ({
			uploadSessionId: item.uploadSessionId,
			attachmentName: item.attachmentName,
			attachmentType: item.attachmentType,
		}));

	return {
		newUploadSessionIds,
		attachmentMetas,
		retainAttachmentIds: editableAttachments.value.map((item) => item.id),
		deleteAttachmentIds: removedAttachmentIds.value.slice(),
	};
}

defineExpose({
	plusFormInstance,
	formComputed,
	resetUploadState,
	getHasBlockingUpload: () => hasBlockingUpload.value,
	getAttachmentSubmitState,
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
			:grid="{ cols: 24 }"
		/>

		<section class="mt-4 space-y-4">
			<div v-if="existingAttachments.length" class="rounded-lg border border-[var(--el-border-color-light)] p-4">
				<div class="mb-3 text-sm font-medium text-[var(--el-text-color-primary)]">
					{{ transformI18n($t("property-manage_contract-manage.draft-contract.fields.attachments")) }}
				</div>
				<div class="space-y-2">
					<div
						v-for="item in existingAttachments"
						:key="item.id"
						class="flex items-center justify-between gap-3 rounded-md bg-[var(--el-fill-color-light)] px-3 py-2"
						:class="removedAttachmentIds.includes(item.id) ? 'opacity-50' : ''"
					>
						<div class="min-w-0">
							<div class="truncate text-sm" :class="removedAttachmentIds.includes(item.id) ? 'line-through' : ''">
								{{ item.attachmentName }}
							</div>
							<div class="text-xs text-[var(--el-text-color-secondary)]">
								{{ item.attachmentType || "-" }} / {{ item.fileSize || 0 }} B
							</div>
						</div>
						<ElButton
							v-if="mode === 'edit'"
							size="small"
							:type="removedAttachmentIds.includes(item.id) ? 'success' : 'danger'"
							link
							@click="toggleExistingAttachment(item)"
						>
							{{
								removedAttachmentIds.includes(item.id)
									? transformI18n($t(draftContractFormMessageKeys.restoreAttachment))
									: transformI18n($t(draftContractFormMessageKeys.removeAttachment))
							}}
						</ElButton>
					</div>
				</div>
			</div>

			<div class="rounded-lg border border-dashed border-[var(--el-border-color)] p-4">
				<div class="mb-3 text-sm font-medium text-[var(--el-text-color-primary)]">
					{{ transformI18n($t("property-manage_contract-manage.draft-contract.fields.attachments")) }}
				</div>
				<ContractDraftUpload
					:key="uploadRenderKey"
					ref="uploadRef"
					v-model="form.attachments"
					biz-type="draft_contract"
					:attachment-type-options="uploadAttachmentTypeOptions"
				/>
			</div>
		</section>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
