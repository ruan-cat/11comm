<script lang="ts" setup>
definePage({
	meta: {
		// 强制回单
		title: "propertyManage_repairsManage.mandatory-return-issue.pageTitle",
		icon: "mdi:clipboard-alert",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.mandatoryReturnIssue"),
	},
});

import { ref, h } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type MandatoryReturnIssueFormProps, defaultForm } from "./components/form";
import MandatoryReturnIssueForm from "./components/form.vue";
import { useMandatoryReturnIssueListQuery } from "@/api/property-manage/repairs-manage/mandatory-return-issue";
import type {
	MandatoryReturnIssueListItem,
	MandatoryReturnIssueQueryParams,
	MandatoryReturnIssueFormVO,
} from "@01s-11comm/type";
import { repairTypeOptions, mandatoryReturnIssueStatusOptions } from "@01s-11comm/type";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const mandatoryReturnIssueFormInstance = ref<InstanceType<typeof MandatoryReturnIssueForm> | null>(null);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.fields.workOrderNumber")),
		),
		prop: "workOrderNumber",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.fields.location")),
		),
		prop: "location",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.fields.repairType")),
		),
		prop: "repairType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.fields.reporter")),
		),
		prop: "reporter",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.fields.contactInfo")),
		),
		prop: "contactInfo",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.fields.appointmentTime")),
		),
		prop: "appointmentTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.fields.submitTime")),
		),
		prop: "submitTime",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.fields.status")),
		),
		prop: "status",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.pageTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 */
const plusSearchModelRef: FieldValues & MandatoryReturnIssueQueryParams = {
	repairType: "",
	reporter: "",
	contactPhone: "",
	pageIndex: 1,
	pageSize: 10,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useMandatoryReturnIssueListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.search.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.search.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.search.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置 */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: MandatoryReturnIssueListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const 业务对象: MandatoryReturnIssueFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: cloneDeep({
				...defaultForm,
				workOrderNumber: row?.workOrderNumber || "",
				location: row?.location || "",
				repairType: row?.repairType || "",
				reporter: row?.reporter || "",
				contactInfo: row?.contactInfo || "",
				appointmentTime: row?.appointmentTime || "",
				submitTime: row?.submitTime || "",
				status: row?.status || "",
				remark: row?.remark || "",
			});
	const defaultValues = cloneDeep(业务对象);

	/** 表单组件需要的props */
	const formProps: MandatoryReturnIssueFormProps = {
		form: 业务对象,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.dialogs.addTitle"))
				: transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(MandatoryReturnIssueForm, {
				ref: mandatoryReturnIssueFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = mandatoryReturnIssueFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = mandatoryReturnIssueFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					mandatoryReturnIssueFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await mandatoryReturnIssueFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
					}
				},
			},
		],
	});
}

/** 新增按钮点击事件 */
function handleAdd() {
	openDialog({ mode: "add" });
}

/** 编辑按钮点击事件 */
function handleEdit(row: MandatoryReturnIssueListItem) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: MandatoryReturnIssueListItem) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: MandatoryReturnIssueListItem) {
	// TODO: 实现删除逻辑
}

/** 强制回单按钮点击事件 */
async function handleMandatoryReturn(row: MandatoryReturnIssueListItem) {
	// TODO: 实现强制回单逻辑
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
				<ElButton type="primary" @click="handleAdd">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="handleView(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="handleMandatoryReturn(row)">
							{{ transformI18n($t("propertyManage_repairsManage.mandatory-return-issue.buttons.mandatoryReturn")) }}
						</ElButton>
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>
