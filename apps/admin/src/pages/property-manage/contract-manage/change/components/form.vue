<!--
  合同变更表单
  用于新增 修改合同变更
-->
<script lang="ts" setup>
import { computed, ref, useTemplateRef, watch } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import type {
	ChangeAttachmentDraft,
	ChangeCreatePayload,
	ChangeUpdatePayload,
	ContractChangeFormVO,
} from "@01s-11comm/type";
import type { ResumableUploadCompletedAsset } from "../../shared-upload/types";
import ContractManageSharedUpload from "../../shared-upload/index.vue";
import {
	buildChangeCreatePayload,
	buildChangeUpdatePayload,
	mergeChangeAttachmentDrafts,
	normalizeChangeAttachmentDrafts,
} from "../utils/attachment";
import type { ContractChangeFormProps } from "./form";

const props = defineProps<ContractChangeFormProps>();
const changeFormMessageKeys = {
	attachmentCountSuffix: "property-manage_contract-manage.contract-change.messages.attachmentCountSuffix",
	attachmentRetained: "property-manage_contract-manage.contract-change.messages.attachmentRetained",
	attachmentDeleted: "property-manage_contract-manage.contract-change.messages.attachmentDeleted",
	restoreAttachment: "property-manage_contract-manage.contract-change.actions.restoreAttachment",
	deleteAttachment: "property-manage_contract-manage.contract-change.actions.deleteAttachment",
} as const;

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & ContractChangeFormVO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & ContractChangeFormVO;

/**
 * 表单对象
 * @description
 * 本表单对象都来自于外部传递
 */
const form = ref(toRefForm);

/** 只读态 */
const isReadOnly = computed(() => props.mode === "info");

/** 只读的表单对象 用于外部做判断 */
const formComputed = computed(() => form.value);

/** 已完成上传的附件 */
const uploadedAssets = ref<ResumableUploadCompletedAsset[]>([]);

type ExistingChangeAttachmentDraft = Extract<ChangeAttachmentDraft, { source: "existing" }>;

/** 旧附件草稿 */
const existingAttachmentDrafts = ref<ExistingChangeAttachmentDraft[]>([]);

watch(
	() => props.form.attachments,
	(value) => {
		const normalizedAttachments = normalizeChangeAttachmentDrafts(value ?? []);

		existingAttachmentDrafts.value = normalizedAttachments.filter(
			(item): item is ExistingChangeAttachmentDraft => item.source === "existing",
		);
		uploadedAssets.value = normalizedAttachments
			.filter((item): item is ChangeAttachmentDraft & { source: "new" } => item.source === "new" && !item.deleted)
			.map((item) => ({
				uploadSessionId: item.uploadSessionId,
				attachmentName: item.attachmentName,
				attachmentType: item.attachmentType,
				fileName: item.fileName,
				fileSize: item.fileSize,
				mimeType: item.mimeType,
				fileUrl: item.fileUrl,
				objectKey: item.objectKey,
			}));
	},
	{ deep: true, immediate: true },
);

/** 附件草稿统一视图 */
const attachmentDrafts = computed(() =>
	mergeChangeAttachmentDrafts(existingAttachmentDrafts.value, uploadedAssets.value),
);

/** 合同类型选项 */
const translatedContractTypeOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.contractTypes.purchase")),
		value: "采购合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.contractTypes.sales")),
		value: "销售合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.contractTypes.service")),
		value: "服务合同",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.contractTypes.lease")),
		value: "租赁合同",
	},
]);

/** 变更类型选项 */
const translatedChangeTypeOptions = computed(() => [
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.amount")),
		value: "合同金额",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.period")),
		value: "服务期限",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.content")),
		value: "服务内容",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.payment")),
		value: "付款方式",
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.options.changeTypes.subject")),
		value: "合同主体",
	},
]);

/**
 * 为字段属性补充只读态。
 * @description
 * 合同变更详情态和编辑态共用同一套列配置，这里统一把 `disabled` 合并进字段属性。
 */
function withReadonly<T extends Record<string, unknown>>(fieldProps: T) {
	return {
		...fieldProps,
		disabled: isReadOnly.value,
	} as any;
}

/**
 * 切换既有附件的删除状态。
 * @description
 * 历史附件在编辑态下通过草稿对象维护删除标记，提交时再统一折算成保留 ID 和删除 ID。
 */
function toggleExistingAttachmentDeleted(attachmentId: string, deleted: boolean) {
	const target = existingAttachmentDrafts.value.find((item) => item.id === attachmentId);
	if (!target) {
		return;
	}

	target.deleted = deleted;
}

/**
 * 组装提交 payload
 * @description
 * 由页面层决定最终调用创建还是更新接口
 */
function collectSubmitPayload() {
	const { attachments: _attachments, ...formValue } = form.value;

	if (props.mode === "add") {
		return buildChangeCreatePayload(
			formValue as Omit<ChangeCreatePayload, "newUploadSessionIds" | "attachmentMetas">,
			attachmentDrafts.value,
		);
	}

	return buildChangeUpdatePayload(
		{
			...(formValue as Omit<
				ChangeUpdatePayload,
				"retainAttachmentIds" | "deleteAttachmentIds" | "newUploadSessionIds" | "attachmentMetas"
			>),
			id: (props.form as ContractChangeFormVO & { id?: string }).id || "",
		},
		attachmentDrafts.value,
	);
}

const plusFormColumns = computed<PlusColumn[]>(() => [
	// 合同变更信息分组标题
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractChangeTitle")),
		prop: "contractChangeTitle",
		span: 24,
	},
	// 合同基本信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractName")),
		prop: "contractName",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.contractName")),
		}),
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractNumber")),
		prop: "contractNumber",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.contract-change.form.placeholders.contractNumber"),
			),
		}),
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractType")),
		prop: "contractType",
		valueType: "select",
		options: translatedContractTypeOptions.value,
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			filterable: true,
		}),
	},
	// 甲方信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyA")),
		prop: "partyA",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyA")),
		}),
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyAContact")),
		prop: "partyAContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyAContact")),
		}),
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyAPhone")),
		prop: "partyAPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyAPhone")),
		}),
	},
	// 乙方信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyB")),
		prop: "partyB",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyB")),
		}),
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyBContact")),
		prop: "partyBContact",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyBContact")),
		}),
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.partyBPhone")),
		prop: "partyBPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.partyBPhone")),
		}),
	},
	// 经办信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.handler")),
		prop: "handler",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.handler")),
		}),
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.handlerPhone")),
		prop: "handlerPhone",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.handlerPhone")),
		}),
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.contractAmount")),
		prop: "contractAmount",
		valueType: "input",
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n(
				$t("property-manage_contract-manage.contract-change.form.placeholders.contractAmount"),
			),
		}),
	},
	// 时间信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: withReadonly({
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.startTime")),
		}),
		required: true,
		span: 8,
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: withReadonly({
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.endTime")),
		}),
		required: true,
		span: 8,
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.signingTime")),
		prop: "signingTime",
		valueType: "date-picker",
		fieldProps: withReadonly({
			type: "datetime",
			format: "YYYY-MM-DD HH:mm:ss",
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.signingTime")),
		}),
		required: true,
		span: 8,
	},
	// 变更信息
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.changeType")),
		prop: "changeType",
		valueType: "select",
		options: translatedChangeTypeOptions.value,
		required: true,
		span: 8,
		fieldProps: withReadonly({
			clearable: true,
			filterable: true,
		}),
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.changer")),
		prop: "changer",
		valueType: "input",
		required: true,
		span: 16,
		fieldProps: withReadonly({
			clearable: true,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.changer")),
		}),
	},
	// 变更前后内容
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.beforeChange")),
		prop: "beforeChange",
		valueType: "textarea",
		fieldProps: withReadonly({
			rows: 4,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.beforeChange")),
		}),
		required: true,
		span: 24,
	},
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.afterChange")),
		prop: "afterChange",
		valueType: "textarea",
		fieldProps: withReadonly({
			rows: 4,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.afterChange")),
		}),
		required: true,
		span: 24,
	},
	// 说明
	{
		label: transformI18n($t("property-manage_contract-manage.contract-change.form.fields.description")),
		prop: "description",
		valueType: "textarea",
		fieldProps: withReadonly({
			rows: 4,
			placeholder: transformI18n($t("property-manage_contract-manage.contract-change.form.placeholders.description")),
		}),
		required: true,
		span: 24,
	},
]);

/** 表单校验规则 */
const plusFormRules = computed<PlusFormRules>(() => ({
	contractName: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractName")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 50,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractNameLength")),
			trigger: "blur",
		},
	],
	contractNumber: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractNumber")),
			trigger: "blur",
		},
		{
			min: 2,
			max: 30,
			message: transformI18n(
				$t("property-manage_contract-manage.contract-change.form.validation.contractNumberLength"),
			),
			trigger: "blur",
		},
	],
	contractType: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractType")),
			trigger: "change",
		},
	],
	partyA: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyA")),
			trigger: "blur",
		},
	],
	partyAContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyAContact")),
			trigger: "blur",
		},
	],
	partyAPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyAPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	partyB: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyB")),
			trigger: "blur",
		},
	],
	partyBContact: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyBContact")),
			trigger: "blur",
		},
	],
	partyBPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.partyBPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	handler: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.handler")),
			trigger: "blur",
		},
	],
	handlerPhone: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.handlerPhone")),
			trigger: "blur",
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.phoneFormat")),
			trigger: "blur",
		},
	],
	contractAmount: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.contractAmount")),
			trigger: "blur",
		},
	],
	startTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.startTime")),
			trigger: "change",
		},
	],
	endTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.endTime")),
			trigger: "change",
		},
	],
	signingTime: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.signingTime")),
			trigger: "change",
		},
	],
	changeType: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.changeType")),
			trigger: "change",
		},
	],
	changer: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.changer")),
			trigger: "blur",
		},
	],
	beforeChange: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.beforeChange")),
			trigger: "blur",
		},
	],
	afterChange: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.afterChange")),
			trigger: "blur",
		},
	],
	description: [
		{
			required: true,
			message: transformI18n($t("property-manage_contract-manage.contract-change.form.validation.description")),
			trigger: "blur",
		},
	],
}));

defineExpose({
	plusFormInstance,
	formComputed,
	collectSubmitPayload,
	attachmentDrafts,
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

		<div class="mt-4 rounded-lg border border-dashed border-[var(--el-border-color)] p-4">
			<div class="mb-3 flex items-center justify-between gap-3">
				<div>
					<div class="text-sm font-medium">
						{{ transformI18n($t("property-manage_contract-manage.contract-change.form.fields.attachments")) }}
					</div>
				</div>
				<el-tag type="info" effect="plain">
					{{ attachmentDrafts.length }}
					{{ transformI18n($t(changeFormMessageKeys.attachmentCountSuffix)) }}
				</el-tag>
			</div>

			<template v-if="!isReadOnly">
				<ContractManageSharedUpload v-model="uploadedAssets" biz-type="change" />
			</template>

			<div class="mt-4 space-y-3">
				<div
					v-for="attachment in existingAttachmentDrafts"
					:key="attachment.id"
					class="rounded-md border border-[var(--el-border-color-lighter)] p-3"
				>
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<div class="truncate text-sm font-medium">{{ attachment.attachmentName }}</div>
							<div class="mt-1 text-xs text-[var(--el-text-color-secondary)]">
								{{ attachment.attachmentType || "-" }} · {{ attachment.contractName || "-" }}
							</div>
						</div>

						<div class="flex items-center gap-2">
							<el-tag :type="attachment.deleted ? 'danger' : 'success'" effect="plain">
								{{
									attachment.deleted
										? transformI18n($t(changeFormMessageKeys.attachmentDeleted))
										: transformI18n($t(changeFormMessageKeys.attachmentRetained))
								}}
							</el-tag>
							<template v-if="!isReadOnly">
								<el-button
									v-if="attachment.deleted"
									size="small"
									plain
									@click="toggleExistingAttachmentDeleted(attachment.id, false)"
								>
									{{ transformI18n($t(changeFormMessageKeys.restoreAttachment)) }}
								</el-button>
								<el-button
									v-else
									size="small"
									type="danger"
									plain
									@click="toggleExistingAttachmentDeleted(attachment.id, true)"
								>
									{{ transformI18n($t(changeFormMessageKeys.deleteAttachment)) }}
								</el-button>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
