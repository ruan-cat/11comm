<script lang="ts" setup>
definePage({
	meta: {
		// 小区公示
		title: "propertyManage_communityManage.notice.pageTitle",
		icon: "mdi:bullhorn",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.notice"),
	},
});

import { h, ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { sleep } from "@antfu/utils";
import { useToggle } from "@vueuse/core";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import type { CommunityNoticeListItem, CommunityNoticeQueryParams } from "@01s-11comm/type";
import { noticeTypeOptions, noticeListDataToFormData as listDataToFormData } from "@01s-11comm/type";
import { useCommunityNoticeListQuery } from "@/api/property-manage/community-manage/notice";
import { type CommunityNoticeFormProps, defaultForm } from "./components/form";
import CommunityNoticeForm from "./components/form.vue";
import { useGotoDetailsPage } from "@/composables/use-goto-details-page";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

const communityNoticeFormInstance = ref<InstanceType<typeof CommunityNoticeForm> | null>(null);

const plusSearchModelRef: FieldValues & Partial<CommunityNoticeQueryParams> = {
	noticeTitle: "",
	noticeType: undefined,
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useCommunityNoticeListQuery(plusSearchDefaultValues);

const selectedRows = ref<CommunityNoticeListItem[]>([]);
const hasSelection = computed(() => selectedRows.value.length > 0);

const noticeTypeLabelKeyMap = {
	notification: $t("propertyManage_communityManage.notice.typeOptions.notice"),
	announcement: $t("propertyManage_communityManage.notice.typeOptions.announcement"),
	reminder: $t("propertyManage_communityManage.notice.typeOptions.reminder"),
	activity: $t("propertyManage_communityManage.notice.typeOptions.activity"),
	maintenance: $t("propertyManage_communityManage.notice.typeOptions.maintenance"),
	safety: $t("propertyManage_communityManage.notice.typeOptions.security"),
} as const;

function translateNoticeType(value?: string | null) {
	if (!value) {
		return value ?? "";
	}

	const key = noticeTypeLabelKeyMap[value as keyof typeof noticeTypeLabelKeyMap];
	return key ? transformI18n(key) : value;
}

const translatedNoticeTypeOptions = computed(() =>
	noticeTypeOptions.map((option) => ({
		...option,
		label: translateNoticeType(String(option.value)),
	})),
);

const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.notice.publicityTitle"))),
		prop: "noticeTitle",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.notice.publicityType"))),
		prop: "noticeType",
		width: 120,
		cellRenderer: ({ row }) => translateNoticeType(row.noticeType),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.notice.publishTime"))),
		prop: "noticeTime",
		width: 160,
		sortable: true,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_communityManage.notice.publisher"))),
		prop: "publisher",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_communityManage.notice.pageTitle")),
	columns: columns.value,
}));

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_communityManage.notice.publicityTitle")),
		prop: "noticeTitle",
		valueType: "input",
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.notice.publicityTitlePlaceholder")),
		},
	},
	{
		label: transformI18n($t("propertyManage_communityManage.notice.publicityType")),
		prop: "noticeType",
		valueType: "select",
		options: translatedNoticeTypeOptions.value,
		fieldProps: {
			placeholder: transformI18n($t("propertyManage_communityManage.notice.form.typePlaceholder")),
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues, { showNumber: 2 });

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

function handleSelectionChange(selection: CommunityNoticeListItem[]) {
	selectedRows.value = selection;
}

async function handleBatchDelete() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning(transformI18n($t("propertyManage_communityManage.notice.noSelection")));
		return;
	}

	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("propertyManage_communityManage.notice.batchDeleteConfirm"), {
				count: selectedRows.value.length,
			}),
			transformI18n($t("propertyManage_communityManage.notice.batchDeleteTitle")),
			{
				confirmButtonText: transformI18n($t("common.buttons.del")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		await new Promise((resolve) => setTimeout(resolve, 500));
		ElMessage.success(
			i18n.global.t($t("propertyManage_communityManage.notice.operationSuccess"), {
				operation: transformI18n($t("common.buttons.del")),
			}),
		);
		selectedRows.value = [];
		await doFetch();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error(
				i18n.global.t($t("propertyManage_communityManage.notice.operationFailed"), {
					operation: transformI18n($t("common.buttons.del")),
				}),
			);
		}
	}
}

async function handleBatchPublish() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning(transformI18n($t("propertyManage_communityManage.notice.noSelection")));
		return;
	}

	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("propertyManage_communityManage.notice.batchPublishConfirm"), {
				count: selectedRows.value.length,
			}),
			transformI18n($t("propertyManage_communityManage.notice.batchPublishTitle")),
			{
				confirmButtonText: transformI18n($t("propertyManage_communityManage.notice.publish")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "success",
			},
		);

		await new Promise((resolve) => setTimeout(resolve, 500));
		ElMessage.success(
			i18n.global.t($t("propertyManage_communityManage.notice.operationSuccess"), {
				operation: transformI18n($t("propertyManage_communityManage.notice.publish")),
			}),
		);
		selectedRows.value = [];
		await doFetch();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error(
				i18n.global.t($t("propertyManage_communityManage.notice.operationFailed"), {
					operation: transformI18n($t("propertyManage_communityManage.notice.publish")),
				}),
			);
		}
	}
}

async function handleDelete(row: CommunityNoticeListItem) {
	try {
		await ElMessageBox.confirm(
			i18n.global.t($t("propertyManage_communityManage.notice.deleteConfirm"), { title: row.noticeTitle }),
			transformI18n($t("propertyManage_communityManage.notice.deleteTitle")),
			{
				confirmButtonText: transformI18n($t("common.buttons.del")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		await new Promise((resolve) => setTimeout(resolve, 300));
		ElMessage.success(transformI18n($t("propertyManage_communityManage.notice.deleteSuccess")));
		await doFetch();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error(transformI18n($t("propertyManage_communityManage.notice.deleteFailed")));
		}
	}
}

interface OpenDialogParams {
	mode: Mode;
	row?: CommunityNoticeListItem;
}

const { modeText, setMode, isAdd, isEdit } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	await sleep(1300);
	setIsLoadingT(false);
}

function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const formProps: CommunityNoticeFormProps = {
		form: structuredClone(defaultForm),
		defaultValues: structuredClone(defaultForm),
		mode,
	};

	let editFormProps: CommunityNoticeFormProps | null = null;
	if (row && isEdit.value) {
		const formData = listDataToFormData(row);
		editFormProps = {
			form: formData,
			defaultValues: structuredClone(formData),
			mode,
		};
	}

	const props = isAdd.value ? formProps : editFormProps || formProps;
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => `${modeText.value}${transformI18n($t("propertyManage_communityManage.notice.pageTitle"))}`,
		props,
		width: "800px",
		contentRenderer: () =>
			h(CommunityNoticeForm, {
				ref: communityNoticeFormInstance,
				...props,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = communityNoticeFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = communityNoticeFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					communityNoticeFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await communityNoticeFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						try {
							await testAsync();
							ElMessage.success(
								i18n.global.t($t("propertyManage_communityManage.notice.operationSuccess"), {
									operation: modeText.value,
								}),
							);
							closeDialog(options, index);
							await doFetch();
						} catch {
							ElMessage.error(
								i18n.global.t($t("propertyManage_communityManage.notice.operationFailed"), {
									operation: modeText.value,
								}),
							);
						} finally {
							button.btn.loading = false;
						}
					}
				},
			},
		],
	});
}

const { gotoDetailPage } = useGotoDetailsPage();

function gotoNoticeDetailPage(row: CommunityNoticeListItem) {
	gotoDetailPage({
		name: "property-manage-community-manage--detail-page",
		params: {
			id: row.headerImage,
		},
	});
}
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<div>
					<ElButton type="primary" @click="openDialog({ mode: 'add' })">
						<template #icon>
							<IconifyIcon icon="ep:plus" />
						</template>
						{{ transformI18n($t("common.buttons.add")) }}
					</ElButton>
					<ElButton v-if="hasSelection" type="success" @click="handleBatchPublish">
						<template #icon>
							<IconifyIcon icon="ep:upload" />
						</template>
						{{ transformI18n($t("propertyManage_communityManage.notice.batchPublish")) }}
					</ElButton>
					<ElButton v-if="hasSelection" type="danger" @click="handleBatchDelete">
						<template #icon>
							<IconifyIcon icon="ep:delete" />
						</template>
						{{ transformI18n($t("propertyManage_communityManage.notice.batchDelete")) }}
					</ElButton>
				</div>
			</template>

			<template #default="{ size, dynamicColumns }">
				<div v-if="hasSelection">
					<span>
						{{
							i18n.global.t($t("propertyManage_communityManage.notice.selectedCount"), { count: selectedRows.length })
						}}
					</span>
					<ElButton type="text" size="small" @click="selectedRows = []">
						{{ transformI18n($t("propertyManage_communityManage.notice.clearSelection")) }}
					</ElButton>
				</div>

				<PureTable
					:="pureTableProps"
					:loading="isFetching"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
					@selection-change="handleSelectionChange"
				>
					<template #operation="{ row }">
						<div>
							<ElButton type="primary" size="small" @click="gotoNoticeDetailPage(row)">
								{{ transformI18n($t("propertyManage_communityManage.notice.view")) }}
							</ElButton>
							<ElButton type="warning" size="small" @click="openDialog({ mode: 'edit', row })">
								{{ transformI18n($t("common.buttons.edit")) }}
							</ElButton>
							<ElButton type="danger" size="small" @click="handleDelete(row)">
								{{ transformI18n($t("common.buttons.del")) }}
							</ElButton>
						</div>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
