<script lang="ts" setup>
definePage({
	meta: {
		title: "小区公示",
		icon: "mdi:bullhorn",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.notice"),
	},
});

import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { transformI18n } from "@/plugins/i18n";
import type { CommunityNoticeListItem, CommunityNoticeQueryParams } from "@01s-11comm/type";
import { useCommunityNoticeListQuery } from "@/api/property-manage/community-manage/notice";
import { type CommunityNoticeFormProps, defaultForm, 列表数据转表单数据 } from "./components/form";
import { noticeTypeOptions } from "@01s-11comm/type";
import CommunityNoticeForm from "./components/form.vue";

const { t } = useI18n();
const communityNoticeFormInstance = ref<InstanceType<typeof CommunityNoticeForm> | null>(null);

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	useCommunityNoticeListQuery();

/** 选中的表格数据 */
const selectedRows = ref<CommunityNoticeListItem[]>([]);

/** 是否有选中的数据 */
const hasSelection = computed(() => selectedRows.value.length > 0);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "头部照片",
		prop: "headerImage",
		width: 100,
		slot: "headerImage",
	},
	{
		label: "公示标题",
		prop: "noticeTitle",
		minWidth: 200,
		showOverflowTooltip: true,
	},
	{
		label: "公示类型",
		prop: "noticeType",
		width: 100,
	},
	{
		label: "公示时间",
		prop: "noticeTime",
		width: 160,
		sortable: true,
	},
	{
		label: "发布人",
		prop: "publisher",
		width: 100,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	adaptive: true,
	headerAlign: "center",
	loading: isLoading.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: transformI18n($t("propertyManage_communityManage.notice.pageTitle")),
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<CommunityNoticeQueryParams> = {
	noticeTitle: "",
	noticeType: undefined,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 公示标题
	{
		label: "公示标题",
		prop: "noticeTitle",
		valueType: "input",
		fieldProps: {
			placeholder: "请输入公示标题",
		},
	},

	// 公示类型
	{
		label: "公示类型",
		prop: "noticeType",
		valueType: "select",
		options: noticeTypeOptions,
		fieldProps: {
			placeholder: "请选择公示类型",
		},
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 2,
});

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	} as Partial<CommunityNoticeQueryParams>);
}

/** 处理表格选择变化 */
function handleSelectionChange(selection: CommunityNoticeListItem[]) {
	selectedRows.value = selection;
}

/** 批量删除 */
async function handleBatchDelete() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning(transformI18n($t("propertyManage_communityManage.notice.noSelection")));
		return;
	}

	try {
		await ElMessageBox.confirm(
			t("propertyManage_communityManage.notice.batchDeleteConfirm", { count: selectedRows.value.length }),
			t("propertyManage_communityManage.notice.batchDeleteTitle"),
			{
				confirmButtonText: transformI18n($t("common.buttons.del")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		// TODO: 调用批量删除API
		// 模拟删除操作
		await new Promise((resolve) => setTimeout(resolve, 500));

		ElMessage.success(
			t("propertyManage_communityManage.notice.operationSuccess", {
				operation: transformI18n($t("common.buttons.del")),
			}),
		);
		selectedRows.value = [];
		await refetch();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error(
				t("propertyManage_communityManage.notice.operationFailed", {
					operation: transformI18n($t("common.buttons.del")),
				}),
			);
		}
	}
}

/** 批量发布 */
async function handleBatchPublish() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning(transformI18n($t("propertyManage_communityManage.notice.noSelection")));
		return;
	}

	// 所有选中的数据都可以操作
	if (selectedRows.value.length === 0) {
		ElMessage.warning(transformI18n($t("propertyManage_communityManage.notice.noSelection")));
		return;
	}

	try {
		await ElMessageBox.confirm(
			t("propertyManage_communityManage.notice.batchPublishConfirm", { count: selectedRows.value.length }),
			t("propertyManage_communityManage.notice.batchPublishTitle"),
			{
				confirmButtonText: transformI18n($t("propertyManage_communityManage.notice.publish")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "success",
			},
		);

		// TODO: 调用批量发布API
		// 模拟发布操作
		await new Promise((resolve) => setTimeout(resolve, 500));

		ElMessage.success(
			t("propertyManage_communityManage.notice.operationSuccess", {
				operation: transformI18n($t("propertyManage_communityManage.notice.publish")),
			}),
		);
		selectedRows.value = [];
		await refetch();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error(
				t("propertyManage_communityManage.notice.operationFailed", {
					operation: transformI18n($t("propertyManage_communityManage.notice.publish")),
				}),
			);
		}
	}
}

/** 删除单个公示 */
async function handleDelete(row: CommunityNoticeListItem) {
	try {
		await ElMessageBox.confirm(
			t("propertyManage_communityManage.notice.deleteConfirm", { title: row.noticeTitle }),
			t("propertyManage_communityManage.notice.deleteTitle"),
			{
				confirmButtonText: transformI18n($t("common.buttons.del")),
				cancelButtonText: transformI18n($t("common.buttons.cancel")),
				type: "warning",
			},
		);

		// TODO: 调用删除API
		// 模拟删除操作
		await new Promise((resolve) => setTimeout(resolve, 300));

		ElMessage.success(transformI18n($t("propertyManage_communityManage.notice.deleteSuccess")));
		await refetch();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error(transformI18n($t("propertyManage_communityManage.notice.deleteFailed")));
		}
	}
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: CommunityNoticeListItem;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}${transformI18n($t("propertyManage_communityManage.notice.pageTitle"))}`;

	/** 表单组件需要的props */
	const formProps: CommunityNoticeFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};

	/** 编辑模式的表单数据 */
	let editFormProps: CommunityNoticeFormProps | null = null;
	if (row && isEdit.value) {
		const 表单数据 = 列表数据转表单数据(row);
		editFormProps = {
			form: 表单数据,
			defaultValues: cloneDeep(表单数据),
		};
	}

	/** 弹框组件所需的变量 */
	const props = isAdd.value ? formProps : editFormProps || formProps;

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,
		width: "800px",

		contentRenderer: () =>
			h(CommunityNoticeForm, {
				ref: communityNoticeFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = communityNoticeFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = communityNoticeFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					communityNoticeFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 表单提交前验证
					const 验证通过 = communityNoticeFormInstance.value.表单提交前验证();
					if (!验证通过) {
						return;
					}

					// 提交表单时 校验
					const res = await communityNoticeFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						try {
							await testAsync();
							ElMessage.success(
								t("propertyManage_communityManage.notice.operationSuccess", { operation: modeText.value }),
							);
							closeDialog(options, index);
							// 刷新表格数据
							await refetch();
						} catch (error) {
							ElMessage.error(
								t("propertyManage_communityManage.notice.operationFailed", { operation: modeText.value }),
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

// TODO: 需要先调研一下是否有公示页面
/** 跳转到 公示详情页面 */
function gotoNoticeDetailPage(row: CommunityNoticeListItem) {
	gotoDetailPage({
		name: "property-manage-community-manage--detail-page",
		params: {
			id: row.headerImage, // 使用头部照片作为ID，或者可以考虑其他唯一标识
		},
	});
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
});
</script>

<template>
	<section>
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="refetch">
			<template #buttons>
				<div>
					<ElButton type="primary" @click="openDialog({ mode: 'add' })">
						<template #icon>
							<IconifyIcon icon="ep:plus" />
						</template>
						{{ transformI18n($t("common.buttons.add")) }}
					</ElButton>

					<!-- 批量操作按钮 -->
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
				<!-- 选中状态提示 -->
				<div v-if="hasSelection">
					<span>
						{{ t("propertyManage_communityManage.notice.selectedCount", { count: selectedRows.length }) }}
					</span>
					<ElButton type="text" size="small" @click="selectedRows = []">
						{{ transformI18n($t("propertyManage_communityManage.notice.clearSelection")) }}
					</ElButton>
				</div>

				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
					@selection-change="handleSelectionChange"
				>
					<!-- 头部照片 -->
					<template #headerImage="{ row }">
						<el-image :src="row.headerImage" :preview-src-list="[row.headerImage]" :initial-index="0" fit="cover" />
					</template>

					<!-- 操作按钮 -->
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
