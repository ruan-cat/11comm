<script lang="ts" setup>
definePage({
	meta: {
		// 工单池
		title: "propertyManage_repairsManage.issues.pageTitle",
		icon: "mdi:clipboard-multiple",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.issues"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type IssuesSettingFormProps, defaultForm } from "./components/form";
import { type IssuesFormVO, type IssuesListItem, type IssuesQueryParams } from "@01s-11comm/type";
import IssuesSettingForm from "./components/form.vue";
import {
	repairTypeOptions,
	repairStatusOptions,
	repairCategoryOptions,
	repairsSettingTypeOptions,
} from "@01s-11comm/type";
import { useIssuesListQuery } from "@/api/property-manage/repairs-manage/issues";

const { locale, withLocale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const issuesSettingFormInstance = ref<InstanceType<typeof IssuesSettingForm> | null>(null);

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.issues.fields.workOrderCode"))),
		prop: "workOrderCode",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.issues.fields.location"))),
		prop: "location",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.issues.fields.repairType"))),
		prop: "repairType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.issues.fields.maintenanceType")),
		),
		prop: "maintenanceType",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.issues.fields.reporter"))),
		prop: "reporter",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.issues.fields.contactInfo"))),
		prop: "contactInfo",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.issues.fields.appointmentTimeRange")),
		),
		prop: "appointmentTimeRange",
		width: 180,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.issues.fields.submitTime"))),
		prop: "submitTime",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.issues.fields.orderDuration"))),
		prop: "orderDuration",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.issues.fields.completeTime"))),
		prop: "completeTime",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.issues.fields.status"))),
		prop: "status",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置 */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_repairsManage.issues.pageTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<IssuesQueryParams> = {
	workOrderNumber: "",
	reporter: "",
	reporterPhone: "",
	repairType: "",
	repairSettingType: "",
	repairLocation: "",
	maintenanceType: "",
	startTime: "",
	endTime: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

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
} = useIssuesListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.search.workOrderNumber")),
		prop: "workOrderNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.search.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.search.reporterPhone")),
		prop: "reporterPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.search.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.search.repairSettingType")),
		prop: "repairSettingType",
		valueType: "select",
		options: repairsSettingTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.search.repairLocation")),
		prop: "repairLocation",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.search.maintenanceType")),
		prop: "maintenanceType",
		valueType: "select",
		options: repairCategoryOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.search.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.issues.search.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "date",
			valueFormat: "YYYY-MM-DD",
			format: "YYYY-MM-DD",
		},
	},
]);

/** 表格搜索栏组件 配置 */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

/** 测试异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog(params: { mode: Mode; row?: IssuesListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 业务对象 */
	const issuesFormVO: IssuesFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					workOrderCode: row?.workOrderCode || "",
					location: row?.location || "",
					repairType: row?.repairType || "",
					maintenanceType: row?.maintenanceType || "",
					reporter: row?.reporter || "",
					contactInfo: row?.contactInfo || "",
					appointmentTimeRange: row?.appointmentTimeRange || "",
					submitTime: row?.submitTime || "",
					orderDuration: row?.orderDuration || "",
					completeTime: row?.completeTime || "",
					status: row?.status || "",
					violationDescription: row?.violationDescription || "",
					remark: row?.remark || "",
				})
			: structuredClone(defaultForm);
	const defaultValues = structuredClone(issuesFormVO);

	/** 表单组件需要的props */
	const formProps: IssuesSettingFormProps = {
		form: issuesFormVO,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("propertyManage_repairsManage.issues.dialogs.addTitle"))
				: transformI18n($t("propertyManage_repairsManage.issues.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(IssuesSettingForm, {
				ref: issuesSettingFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = issuesSettingFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = issuesSettingFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					issuesSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await issuesSettingFormInstance.value?.plusFormInstance?.handleSubmit();
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
function handleEdit(row: IssuesListItem) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: IssuesListItem) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: IssuesListItem) {
	// TODO: 实现删除逻辑
	consola.log("删除", row);
	await doFetch();
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
				<!-- @vue-ignore -->
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
