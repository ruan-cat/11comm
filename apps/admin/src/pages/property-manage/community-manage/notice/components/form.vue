// @ts-nocheck
<!--
  小区公示表单
  用于新增、修改小区公示
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { ElMessage } from "element-plus";
import { transformI18n } from "@/plugins/i18n";
import type { CommunityNoticeFormVO } from "@01s-11comm/type";
import { noticeTypeOptions, noticeStatusOptions } from "@01s-11comm/type";

import {
	CommunityNoticeFormProps,
	defaultForm,
} from "./form";

const props = defineProps<CommunityNoticeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & CommunityNoticeFormVO;

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
const toRefForm = structuredClone(props.form) as FieldValues & CommunityNoticeFormVO;

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

/** 字数统计相关 */
const titleCharCount = computed(() => form.value.noticeTitle?.length || 0);
const summaryCharCount = computed(() => form.value.summary?.length || 0);

/** 最大字数限制 */
const MAX_TITLE_LENGTH = 100;
const MAX_SUMMARY_LENGTH = 500;

/** 预览模式 */
const showPreview = ref(false);

/** 切换预览模式 */
function togglePreview() {
	showPreview.value = !showPreview.value;
}

/** 监听日期变化，自动更新状态 */
watch([() => form.value.validityStartTime, () => form.value.validityEndTime], ([startTime, endTime]) => {
	if (!startTime || !endTime) return;

	const now = new Date();
	const start = new Date(startTime);
	const end = new Date(endTime);

	if (now < start) {
		// 还未到发布时间
		if (form.value.status === "published") {
			form.value.status = "draft";
		}
	} else if (now > end) {
		// 已过期
		form.value.status = "expired";
	} else {
		// 在有效期内
		if (form.value.status === "draft") {
			form.value.status = "published";
		}
	}
});

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	// 公示标题
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

	// 公示类型
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.type")),
		prop: "noticeType",
		valueType: "select",
		required: true,
		options: noticeTypeOptions,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.typePlaceholder")),
		},
	},

	// 有效期开始
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
			disabledDate: (date: Date) => {
				// 不能选择过去的日期
				return date < new Date(new Date().setHours(0, 0, 0, 0));
			},
		},
	},

	// 有效期结束
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
				// 结束日期不能早于开始日期
				return date < new Date(form.value.validityStartTime);
			},
		},
	},

	// 公示状态
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.status")),
		prop: "status",
		valueType: "select",
		required: true,
		options: noticeStatusOptions,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.statusPlaceholder")),
		},
	},

	// 内容摘要
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

/** 表单项配置 动态计算 只读 */
const plusFormColumnsComputed = computed(() => plusFormColumns.value);

/** 表单校验规则 */
const plusFormRules = computed(() => ({
	noticeTitle: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.titleRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: MAX_TITLE_LENGTH,
			message: transformI18n(
				($t as any)("propertyManage_communityManage.notice.form.titleLength", { min: 2, max: MAX_TITLE_LENGTH }),
			),
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
			message: transformI18n(
				($t as any)("propertyManage_communityManage.notice.form.contentSummaryLength", {
					min: 10,
					max: MAX_SUMMARY_LENGTH,
				}),
			),
			trigger: "blur",
		},
	],
}));

/** 表单提交前的验证 */
function validateBeforeSubmit(): boolean {
	// 检查日期逻辑
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
		<!-- 预览/编辑切换按钮 -->
		<div class="操作栏">
			<ElButton type="primary" plain size="small" :icon="showPreview ? 'Edit' : 'View'" @click="togglePreview">
				{{
					showPreview
						? transformI18n($t("propertyManage_communityManage.notice.form.backToEdit"))
						: transformI18n($t("propertyManage_communityManage.notice.form.previewEffect"))
				}}
			</ElButton>
		</div>

		<!-- 表单编辑区域 -->
		<div v-if="!showPreview" class="表单区域">
			<PlusForm
				ref="plusFormRef"
				v-model="form"
				:has-footer="false"
				:default-values="defaultValues"
				:columns="plusFormColumnsComputed"
				:rules="plusFormRules"
			/>

			<!-- 字数统计显示 -->
			<div class="字数统计区域">
				<div class="统计项">
					<span class="统计标签">{{
						transformI18n($t("propertyManage_communityManage.notice.form.titleCharCount"))
					}}</span>
					<span class="统计数字" :class="{ 字数警告: titleCharCount > MAX_TITLE_LENGTH * 0.9 }">
						{{ titleCharCount }} / {{ MAX_TITLE_LENGTH }}
					</span>
				</div>
				<div class="统计项">
					<span class="统计标签">{{
						transformI18n($t("propertyManage_communityManage.notice.form.summaryCharCount"))
					}}</span>
					<span class="统计数字" :class="{ 字数警告: summaryCharCount > MAX_SUMMARY_LENGTH * 0.9 }">
						{{ summaryCharCount }} / {{ MAX_SUMMARY_LENGTH }}
					</span>
				</div>
			</div>
		</div>

		<!-- 预览区域 -->
		<div v-else class="预览区域">
			<ElCard class="公示预览卡片" shadow="hover">
				<template #header>
					<div class="卡片头部">
						<h3 class="公示标题">
							{{
								form.noticeTitle || transformI18n($t("propertyManage_communityManage.notice.form.preview.titlePreview"))
							}}
						</h3>
						<div class="公示元信息">
							<ElTag
								:type="
									form.noticeType === 'notification'
										? 'primary'
										: form.noticeType === 'announcement'
											? 'success'
											: form.noticeType === 'reminder'
												? 'warning'
												: form.noticeType === 'activity'
													? 'info'
													: form.noticeType === 'maintenance'
														? 'danger'
														: 'primary'
								"
								size="small"
							>
								{{ form.noticeType || transformI18n($t("propertyManage_communityManage.notice.form.preview.type")) }}
							</ElTag>
							<ElTag
								:type="form.status === 'published' ? 'success' : form.status === 'draft' ? 'info' : 'danger'"
								size="small"
							>
								{{ form.status || transformI18n($t("propertyManage_communityManage.notice.form.preview.status")) }}
							</ElTag>
						</div>
					</div>
				</template>

				<div class="公示内容">
					<div class="公示摘要">
						<h4>{{ transformI18n($t("propertyManage_communityManage.notice.form.preview.contentSummary")) }}</h4>
						<p>
							{{ form.summary || transformI18n($t("propertyManage_communityManage.notice.form.preview.noSummary")) }}
						</p>
					</div>

					<div class="公示时间信息">
						<div class="时间项">
							<span class="时间标签">{{
								transformI18n($t("propertyManage_communityManage.notice.form.preview.validityPeriod"))
							}}</span>
							<span class="时间值">
								{{
									form.validityStartTime ||
									transformI18n($t("propertyManage_communityManage.notice.form.preview.startDate"))
								}}
								~
								{{
									form.validityEndTime ||
									transformI18n($t("propertyManage_communityManage.notice.form.preview.endDate"))
								}}
							</span>
						</div>
						<div class="时间项">
							<span class="时间标签">{{
								transformI18n($t("propertyManage_communityManage.notice.form.preview.publisher"))
							}}</span>
							<span class="时间值">{{
								form.publisher || transformI18n($t("propertyManage_communityManage.notice.form.preview.systemAdmin"))
							}}</span>
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

// 响应式设计
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
