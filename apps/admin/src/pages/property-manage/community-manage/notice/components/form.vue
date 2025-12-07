<!--
  小区公示表单
  用于新增、修改小区公示
-->
<script lang="ts" setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { ElMessage } from "element-plus";
import { transformI18n } from "@/plugins/i18n";

import { CommunityNoticeFormProps, 小区公示表单_VO, defaultForm, 公示类型选项, 公示状态选项 } from "./form";

const props = defineProps<CommunityNoticeFormProps>();

/** 默认的表单重置变量 */
const defaultValues = props.defaultValues as FieldValues & 小区公示表单_VO;

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
const toRefForm = cloneDeep(props.form) as FieldValues & 小区公示表单_VO;

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
const 标题字数统计 = computed(() => form.value.标题?.length || 0);
const 摘要字数统计 = computed(() => form.value.内容摘要?.length || 0);

/** 最大字数限制 */
const MAX_TITLE_LENGTH = 100;
const MAX_SUMMARY_LENGTH = 500;

/** 预览模式 */
const 显示预览 = ref(false);

/** 切换预览模式 */
function 切换预览模式() {
	显示预览.value = !显示预览.value;
}

/** 监听日期变化，自动更新状态 */
watch([() => form.value.有效期开始, () => form.value.有效期结束], ([开始时间, 结束时间]) => {
	if (!开始时间 || !结束时间) return;

	const 今天 = new Date();
	const 开始 = new Date(开始时间);
	const 结束 = new Date(结束时间);

	if (今天 < 开始) {
		// 还未到发布时间
		if (form.value.状态 === "已发布") {
			form.value.状态 = "草稿";
		}
	} else if (今天 > 结束) {
		// 已过期
		form.value.状态 = "已过期";
	} else {
		// 在有效期内
		if (form.value.状态 === "草稿") {
			form.value.状态 = "已发布";
		}
	}
});

/** 表单项配置 */
const plusFormColumns = ref<PlusColumn[]>([
	// 公示标题
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.title")),
		prop: "标题",
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
		prop: "类型",
		valueType: "select",
		required: true,
		options: 公示类型选项,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.typePlaceholder")),
		},
	},

	// 有效期开始
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.validityStart")),
		prop: "有效期开始",
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
		prop: "有效期结束",
		valueType: "date-picker",
		required: true,
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.validityEndPlaceholder")),
			disabledDate: (date: Date) => {
				if (!form.value.有效期开始) return false;
				// 结束日期不能早于开始日期
				return date < new Date(form.value.有效期开始);
			},
		},
	},

	// 公示状态
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.status")),
		prop: "状态",
		valueType: "select",
		required: true,
		options: 公示状态选项,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.statusPlaceholder")),
		},
	},

	// 内容摘要
	{
		label: transformI18n($t("propertyManage_communityManage.notice.form.contentSummary")),
		prop: "内容摘要",
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
	标题: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.titleRequired")),
			trigger: "blur",
		},
		{
			min: 2,
			max: MAX_TITLE_LENGTH,
			message: transformI18n(
				$t("propertyManage_communityManage.notice.form.titleLength", { min: 2, max: MAX_TITLE_LENGTH }) as string,
			),
			trigger: "blur",
		},
	],
	类型: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.typeRequired")),
			trigger: "change",
		},
	],
	有效期开始: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.validityStartRequired")),
			trigger: "change",
		},
	],
	有效期结束: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.validityEndRequired")),
			trigger: "change",
		},
		{
			validator: (rule: any, value: string, callback: any) => {
				if (!form.value.有效期开始 || !value) {
					callback();
					return;
				}
				const 开始日期 = new Date(form.value.有效期开始);
				const 结束日期 = new Date(value);
				if (结束日期 < 开始日期) {
					callback(new Error(transformI18n($t("propertyManage_communityManage.notice.form.endBeforeStart"))));
				} else {
					callback();
				}
			},
			trigger: "change",
		},
	],
	状态: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.statusRequired")),
			trigger: "change",
		},
	],
	内容摘要: [
		{
			required: true,
			message: transformI18n($t("propertyManage_communityManage.notice.form.contentSummaryRequired")),
			trigger: "blur",
		},
		{
			min: 10,
			max: MAX_SUMMARY_LENGTH,
			message: transformI18n(
				$t("propertyManage_communityManage.notice.form.contentSummaryLength", {
					min: 10,
					max: MAX_SUMMARY_LENGTH,
				}) as string,
			),
			trigger: "blur",
		},
	],
}));

/** 表单提交前的验证 */
function 表单提交前验证(): boolean {
	// 检查日期逻辑
	if (form.value.有效期开始 && form.value.有效期结束) {
		const 开始日期 = new Date(form.value.有效期开始);
		const 结束日期 = new Date(form.value.有效期结束);

		if (结束日期 < 开始日期) {
			ElMessage.error(transformI18n($t("propertyManage_communityManage.notice.form.endBeforeStart")));
			return false;
		}

		const 今天 = new Date();
		if (form.value.状态 === "已发布" && 开始日期 > 今天) {
			ElMessage.warning("开始日期在未来，建议将状态设为草稿");
		}

		if (form.value.状态 === "已发布" && 结束日期 < 今天) {
			ElMessage.warning("已过有效期，建议将状态设为已过期");
		}
	}

	return true;
}

defineExpose({
	plusFormInstance,
	formComputed,
	表单提交前验证,
});
</script>

<template>
	<section class="form-root">
		<!-- 预览/编辑切换按钮 -->
		<div class="操作栏">
			<ElButton type="primary" plain size="small" :icon="显示预览 ? 'Edit' : 'View'" @click="切换预览模式">
				{{
					显示预览
						? transformI18n($t("propertyManage_communityManage.notice.form.backToEdit"))
						: transformI18n($t("propertyManage_communityManage.notice.form.previewEffect"))
				}}
			</ElButton>
		</div>

		<!-- 表单编辑区域 -->
		<div v-if="!显示预览" class="表单区域">
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
					<span class="统计数字" :class="{ 字数警告: 标题字数统计 > MAX_TITLE_LENGTH * 0.9 }">
						{{ 标题字数统计 }} / {{ MAX_TITLE_LENGTH }}
					</span>
				</div>
				<div class="统计项">
					<span class="统计标签">{{
						transformI18n($t("propertyManage_communityManage.notice.form.summaryCharCount"))
					}}</span>
					<span class="统计数字" :class="{ 字数警告: 摘要字数统计 > MAX_SUMMARY_LENGTH * 0.9 }">
						{{ 摘要字数统计 }} / {{ MAX_SUMMARY_LENGTH }}
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
							{{ form.标题 || transformI18n($t("propertyManage_communityManage.notice.form.preview.titlePreview")) }}
						</h3>
						<div class="公示元信息">
							<ElTag
								:type="
									form.类型 === '通知'
										? 'primary'
										: form.类型 === '公告'
											? 'success'
											: form.类型 === '提醒'
												? 'warning'
												: form.类型 === '活动'
													? 'info'
													: form.类型 === '维修'
														? 'danger'
														: 'primary'
								"
								size="small"
							>
								{{ form.类型 || transformI18n($t("propertyManage_communityManage.notice.form.preview.type")) }}
							</ElTag>
							<ElTag :type="form.状态 === '已发布' ? 'success' : form.状态 === '草稿' ? 'info' : 'danger'" size="small">
								{{ form.状态 || transformI18n($t("propertyManage_communityManage.notice.form.preview.status")) }}
							</ElTag>
						</div>
					</div>
				</template>

				<div class="公示内容">
					<div class="公示摘要">
						<h4>{{ transformI18n($t("propertyManage_communityManage.notice.form.preview.contentSummary")) }}</h4>
						<p>
							{{ form.内容摘要 || transformI18n($t("propertyManage_communityManage.notice.form.preview.noSummary")) }}
						</p>
					</div>

					<div class="公示时间信息">
						<div class="时间项">
							<span class="时间标签">{{
								transformI18n($t("propertyManage_communityManage.notice.form.preview.validityPeriod"))
							}}</span>
							<span class="时间值">
								{{
									form.有效期开始 || transformI18n($t("propertyManage_communityManage.notice.form.preview.startDate"))
								}}
								~
								{{ form.有效期结束 || transformI18n($t("propertyManage_communityManage.notice.form.preview.endDate")) }}
							</span>
						</div>
						<div class="时间项">
							<span class="时间标签">{{
								transformI18n($t("propertyManage_communityManage.notice.form.preview.publisher"))
							}}</span>
							<span class="时间值">{{
								form.发布人 || transformI18n($t("propertyManage_communityManage.notice.form.preview.systemAdmin"))
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
