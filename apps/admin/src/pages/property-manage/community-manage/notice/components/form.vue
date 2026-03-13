// @ts-nocheck
<!--
  小区公示表单
  用于新增、修改小区公示
-->
<script lang="ts" setup>
import { computed, ref, watch, useTemplateRef } from "vue";
import { ElMessage } from "element-plus";
import { noticeStatusOptions, noticeTypeOptions, type CommunityNoticeFormVO } from "@01s-11comm/type";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { CommunityNoticeFormProps } from "./form";

const props = defineProps<CommunityNoticeFormProps>();
const { withLocale } = useI18nConfig();

const defaultValues = props.defaultValues as FieldValues & CommunityNoticeFormVO;
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

const form = ref(cloneDeep(props.form) as FieldValues & CommunityNoticeFormVO);
const formComputed = computed(() => form.value);

const titleCharCount = computed(() => form.value.noticeTitle?.length || 0);
const summaryCharCount = computed(() => form.value.summary?.length || 0);
const MAX_TITLE_LENGTH = 100;
const MAX_SUMMARY_LENGTH = 500;
const showPreview = ref(false);

function togglePreview() {
	showPreview.value = !showPreview.value;
}

const noticeTypeLabelKeyMap = {
	notification: $t("propertyManage_communityManage.notice.typeOptions.notice"),
	announcement: $t("propertyManage_communityManage.notice.typeOptions.announcement"),
	reminder: $t("propertyManage_communityManage.notice.typeOptions.reminder"),
	activity: $t("propertyManage_communityManage.notice.typeOptions.activity"),
	maintenance: $t("propertyManage_communityManage.notice.typeOptions.maintenance"),
	safety: $t("propertyManage_communityManage.notice.typeOptions.security"),
} as const;

const noticeStatusLabelKeyMap = {
	draft: $t("propertyManage_communityManage.notice.statusOptions.draft"),
	published: $t("propertyManage_communityManage.notice.statusOptions.published"),
	expired: $t("propertyManage_communityManage.notice.statusOptions.expired"),
} as const;

function translateNoticeType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}
	const key = noticeTypeLabelKeyMap[value as keyof typeof noticeTypeLabelKeyMap];
	return key ? transformI18n(key) : value;
}

function translateNoticeStatus(value?: string | null) {
	if (!value) {
		return value ?? "";
	}
	const key = noticeStatusLabelKeyMap[value as keyof typeof noticeStatusLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const translatedNoticeTypeOptions = withLocale(() =>
	noticeTypeOptions.map((option) => ({
		...option,
		label: translateNoticeType(String(option.value)),
	})),
);

const translatedNoticeStatusOptions = withLocale(() =>
	noticeStatusOptions.map((option) => ({
		...option,
		label: translateNoticeStatus(String(option.value)),
	})),
);

watch([() => form.value.validityStartTime, () => form.value.validityEndTime], ([startTime, endTime]) => {
	if (!startTime || !endTime) return;

	const now = new Date();
	const start = new Date(startTime);
	const end = new Date(endTime);

	if (now < start) {
		if (form.value.status === "published") {
			form.value.status = "draft";
		}
	} else if (now > end) {
		form.value.status = "expired";
	} else if (form.value.status === "draft") {
		form.value.status = "published";
	}
});

const plusFormColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.title")),
		prop: "noticeTitle",
		valueType: "input",
		required: true,
		fieldProps: {
			maxlength: MAX_TITLE_LENGTH,
			showWordLimit: true,
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.titlePlaceholder")),
		},
		tip: transformI18n($t("propertyManage_communityManage.notice.form.titleTip")),
	},
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.type")),
		prop: "noticeType",
		valueType: "select",
		required: true,
		options: translatedNoticeTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.typePlaceholder")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.validityStart")),
		prop: "validityStartTime",
		valueType: "date-picker",
		required: true,
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.validityStartPlaceholder")),
			disabledDate: (date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0)),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.validityEnd")),
		prop: "validityEndTime",
		valueType: "date-picker",
		required: true,
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.validityEndPlaceholder")),
			disabledDate: (date: Date) => {
				if (!form.value.validityStartTime) return false;
				return date < new Date(form.value.validityStartTime);
			},
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.status")),
		prop: "status",
		valueType: "select",
		required: true,
		options: translatedNoticeStatusOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.statusPlaceholder")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.contentSummary")),
		prop: "summary",
		valueType: "textarea",
		required: true,
		fieldProps: {
			maxlength: MAX_SUMMARY_LENGTH,
			showWordLimit: true,
			rows: 4,
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.contentSummaryPlaceholder")),
		},
		tip: transformI18n($t("propertyManage_communityManage.notice.form.summaryTip")),
	},
]);

const plusFormRules = withLocale(() => ({
	noticeTitle: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.titleRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: MAX_TITLE_LENGTH,
			message: i18n.global.t($t("propertyManage_communityManage.notice.form.titleLength"), { min: 2, max: MAX_TITLE_LENGTH }),
			trigger: "blur",
		},
	],
	noticeType: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.typeRequired")),
			trigger: "change",
		},
	],
	validityStartTime: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.validityStartRequired")),
			trigger: "change",
		},
	],
	validityEndTime: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.validityEndRequired")),
			trigger: "change",
		},
		{
			validator: (rule: any, value: string, callback: any) => {
				if (!form.value.validityStartTime || !value) {
					callback();
					return;
				}
				const start = new Date(form.value.validityStartTime);
				const end = new Date(value);
				if (end < start) {
					callback(new Error(transformI18n($t("propertyManage_communityManage.notice.form.endBeforeStart"))));
				} else {
					callback();
				}
			},
			trigger: "change",
		},
	],
	status: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.statusRequired")),
			trigger: "change",
		},
	],
	summary: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.contentSummaryRequired")),
			trigger: "blur",
		},
		{
			min: 10,
			max: MAX_SUMMARY_LENGTH,
			message: i18n.global.t($t("propertyManage_communityManage.notice.form.contentSummaryLength"), {
				min: 10,
				max: MAX_SUMMARY_LENGTH,
			}),
			trigger: "blur",
		},
	],
}));

function validateBeforeSubmit(): boolean {
	if (form.value.validityStartTime && form.value.validityEndTime) {
		const start = new Date(form.value.validityStartTime);
		const end = new Date(form.value.validityEndTime);

		if (end < start) {
			ElMessage.error(transformI18n($t("propertyManage_communityManage.notice.form.endBeforeStart")));
			return false;
		}

		const now = new Date();
		if (form.value.status === "published" && start > now) {
			ElMessage.warning("开始日期在未来，建议将状态设为草稿");
		}

		if (form.value.status === "published" && end < now) {
			ElMessage.warning("已过有效期，建议将状态设为已过期");
		}
	}

	return true;
}

defineExpose({
	plusFormInstance,
	formComputed,
	validateBeforeSubmit,
});
</script>

<template>
	<section class="form-root">
		<div class="操作栏">
			<ElButton type="primary" plain size="small" :icon="showPreview ? 'Edit' : 'View'" @click="togglePreview">
				{{
					showPreview
						? transformI18n($t("propertyManage_communityManage.notice.form.backToEdit"))
						: transformI18n($t("propertyManage_communityManage.notice.form.previewEffect"))
				}}
			</ElButton>
		</div>

		<div v-if="!showPreview" class="表单区域">
			<PlusForm
				ref="plusFormRef"
				v-model="form"
				:has-footer="false"
				:default-values="defaultValues"
				:columns="plusFormColumns"
				:rules="plusFormRules"
			/>

			<div class="字数统计区域">
				<div class="统计项">
					<span class="统计标签">{{ transformI18n($t("propertyManage_communityManage.notice.form.titleCharCount")) }}</span>
					<span class="统计数字" :class="{ 字数警告: titleCharCount > MAX_TITLE_LENGTH * 0.9 }">
						{{ titleCharCount }} / {{ MAX_TITLE_LENGTH }}
					</span>
				</div>
				<div class="统计项">
					<span class="统计标签">{{ transformI18n($t("propertyManage_communityManage.notice.form.summaryCharCount")) }}</span>
					<span class="统计数字" :class="{ 字数警告: summaryCharCount > MAX_SUMMARY_LENGTH * 0.9 }">
						{{ summaryCharCount }} / {{ MAX_SUMMARY_LENGTH }}
					</span>
				</div>
			</div>
		</div>

		<div v-else class="预览区域">
			<ElCard class="公示预览卡片" shadow="hover">
				<template #header>
					<div class="卡片头部">
						<h3 class="公示标题">
							{{ form.noticeTitle || transformI18n($t("propertyManage_communityManage.notice.form.preview.titlePreview")) }}
						</h3>
						<div class="公示元信息">
							<ElTag type="primary" size="small">
								{{ translateNoticeType(form.noticeType) || transformI18n($t("propertyManage_communityManage.notice.form.preview.type")) }}
							</ElTag>
							<ElTag :type="form.status === 'published' ? 'success' : form.status === 'draft' ? 'info' : 'danger'" size="small">
								{{ translateNoticeStatus(form.status) || transformI18n($t("propertyManage_communityManage.notice.form.preview.status")) }}
							</ElTag>
						</div>
					</div>
				</template>

				<div class="公示内容">
					<div class="公示摘要">
						<h4>{{ transformI18n($t("propertyManage_communityManage.notice.form.preview.contentSummary")) }}</h4>
						<p>{{ form.summary || transformI18n($t("propertyManage_communityManage.notice.form.preview.noSummary")) }}</p>
					</div>

					<div class="公示时间信息">
						<div class="时间项">
							<span class="时间标签">{{ transformI18n($t("propertyManage_communityManage.notice.form.preview.validityPeriod")) }}</span>
							<span class="时间值">
								{{ form.validityStartTime || transformI18n($t("propertyManage_communityManage.notice.form.preview.startDate")) }}
								~
								{{ form.validityEndTime || transformI18n($t("propertyManage_communityManage.notice.form.preview.endDate")) }}
							</span>
						</div>
						<div class="时间项">
							<span class="时间标签">{{ transformI18n($t("propertyManage_communityManage.notice.form.preview.publisher")) }}</span>
							<span class="时间值">
								{{ form.publisher || transformI18n($t("propertyManage_communityManage.notice.form.preview.systemAdmin")) }}
							</span>
						</div>
					</div>
				</div>
			</ElCard>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;

	.操作栏 {
		margin-bottom: 16px;
		display: flex;
		justify-content: flex-end;
	}

	.表单区域 {
		.字数统计区域 {
			margin-top: 16px;
			padding: 12px;
			background-color: #f8f9fa;
			border-radius: 6px;
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;
			gap: 12px;

			.统计项 {
				display: flex;
				align-items: center;
				gap: 8px;

				.统计标签 {
					font-size: 14px;
					color: #606266;
					font-weight: 500;
				}

				.统计数字 {
					font-size: 14px;
					color: #409eff;
					font-weight: 600;
					transition: color 0.3s ease;

					&.字数警告 {
						color: #e6a23c;

						&:hover {
							color: #f56c6c;
						}
					}
				}
			}
		}
	}

	.预览区域 {
		.公示预览卡片 {
			max-width: 100%;

			.卡片头部 {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				gap: 12px;

				.公示标题 {
					margin: 0;
					font-size: 18px;
					font-weight: 600;
					color: #303133;
				}

				.公示元信息 {
					display: flex;
					gap: 8px;
					flex-wrap: wrap;
				}
			}

			.公示内容 {
				.公示摘要 {
					margin-bottom: 16px;

					h4 {
						margin: 0 0 8px 0;
						font-size: 16px;
						font-weight: 600;
						color: #606266;
					}

					p {
						margin: 0;
						line-height: 1.6;
						color: #303133;
						white-space: pre-wrap;
						word-break: break-word;
					}
				}

				.公示时间信息 {
					border-top: 1px solid #ebeef5;
					padding-top: 16px;
					display: flex;
					flex-direction: column;
					gap: 8px;

					.时间项 {
						display: flex;
						gap: 8px;

						.时间标签 {
							font-weight: 500;
							color: #606266;
							min-width: 60px;
						}

						.时间值 {
							color: #303133;
						}
					}
				}
			}
		}
	}
}

@media (max-width: 768px) {
	.form-root {
		.表单区域 {
			.字数统计区域 {
				flex-direction: column;
				align-items: flex-start;
				gap: 8px;

				.统计项 {
					width: 100%;
					justify-content: space-between;
				}
			}
		}

		.预览区域 {
			.公示预览卡片 {
				.卡片头部 {
					flex-direction: column;
					align-items: flex-start;

					.公示标题 {
						font-size: 16px;
					}
				}

				.公示内容 {
					.公示时间信息 {
						.时间项 {
							flex-direction: column;
							gap: 4px;

							.时间标签 {
								min-width: auto;
							}
						}
					}
				}
			}
		}
	}
}
</style>
