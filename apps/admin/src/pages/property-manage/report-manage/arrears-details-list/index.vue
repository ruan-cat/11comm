<script lang="ts" setup>
definePage({
	meta: {
		// 欠费明细表
		title: "property-manage_report-manage.arrears-details-list.pageTitle",
		icon: "mdi:cash-minus",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.arrearsDetailsList"),
	},
});

import { ref, h } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import consola from "consola";
import { useToggle } from "@vueuse/core";

import { $t, i18n, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import type { ArrearsDetailsFormVO, ArrearsDetailsListItem, ArrearsDetailsListQueryParams } from "@01s-11comm/type";
import { type ArrearsDetailsFormProps, defaultForm as defaultArrearsDetailsForm } from "./components/form";
import ArrearsDetailsForm from "./components/form.vue";
import { useArrearsDetailsListQuery } from "@/api/property-manage/report-manage/arrears-details-list";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

const smallTotal = ref<number>(0);
const largeTotal = ref<number>(0);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const arrearsDetailsFormInstance = ref<InstanceType<typeof ArrearsDetailsForm> | null>(null);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.feeNumber")),
		),
		prop: "费用编号",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.roomNumber")),
		),
		prop: "房号",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.owner")),
		),
		prop: "业主",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.ownerPhone")),
		),
		prop: "业主电话",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.area")),
		),
		prop: "面积",
		width: 90,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.feeItem")),
		),
		prop: "费用项",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.startTime")),
		),
		prop: "开始时间",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.endTime")),
		),
		prop: "结束时间",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.arrearsDuration")),
		),
		prop: "欠费时长",
		width: 130,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.arrears-details-list.fields.arrearsAmount")),
		),
		prop: "欠费金额",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.arrears-details-list.pageTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ArrearsDetailsListQueryParams> = {
	feeCategory: "",
	roomNumber: "",
	startTime: "",
	endTime: "",
	community: "",
	ownerName: "",
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
} = useArrearsDetailsListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.search.feeCategory")),
		prop: "feeCategory",
		valueType: "select",
		options: [],
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.search.roomNumber")),
		prop: "roomNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.search.startTime")),
		prop: "startTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.search.endTime")),
		prop: "endTime",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.search.community")),
		prop: "community",
		valueType: "select",
		options: [],
	},
	{
		label: transformI18n($t("property-manage_report-manage.arrears-details-list.search.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
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

/** 测试异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ArrearsDetailsListItem;
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 业务对象 */
	const formValue: ArrearsDetailsFormVO = isAdd.value
		? cloneDeep(defaultArrearsDetailsForm)
		: isEdit.value
			? cloneDeep({
					...defaultArrearsDetailsForm,
					feeNumber: row?.feeNumber || "",
					roomNumber: row?.roomNumber || "",
					owner: row?.owner || "",
					ownerPhone: row?.ownerPhone || "",
					area: row?.area || "",
					feeItem: row?.feeItem || "",
					startTime: row?.startTime || "",
					endTime: row?.endTime || "",
					arrearsDuration: row?.arrearsDuration || "",
					arrearsAmount: row?.arrearsAmount || "",
				})
			: cloneDeep(defaultArrearsDetailsForm);
	const defaultValues = cloneDeep(formValue);

	/** 表单组件需要的props */
	const formProps: ArrearsDetailsFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_report-manage.arrears-details-list.dialogs.addTitle"))
				: transformI18n($t("property-manage_report-manage.arrears-details-list.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(ArrearsDetailsForm, {
				ref: arrearsDetailsFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = arrearsDetailsFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = arrearsDetailsFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					arrearsDetailsFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await arrearsDetailsFormInstance.value?.plusFormInstance?.handleSubmit();
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
function handleEdit(row: ArrearsDetailsListItem) {
	openDialog({ mode: "edit", row });
}

/** 查看按钮点击事件 */
function handleView(row: ArrearsDetailsListItem) {
	openDialog({ mode: "info", row });
}

/** 删除按钮点击事件 */
async function handleDelete(row: ArrearsDetailsListItem) {
	consola.log("删除", row);
	// TODO: 调用删除API并刷新列表
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

		<section class="summary">
			<div>
				{{
					i18n.global.t($t("property-manage_report-manage.arrears-details-list.summary.subtotalArrears"), {
						amount: smallTotal,
					})
				}}
			</div>
			<div>
				{{
					i18n.global.t($t("property-manage_report-manage.arrears-details-list.summary.totalArrears"), {
						amount: largeTotal,
					})
				}}
			</div>
			<div>{{ transformI18n($t("property-manage_report-manage.arrears-details-list.summary.feeStartTimeNote")) }}</div>
			<div>
				{{ transformI18n($t("property-manage_report-manage.arrears-details-list.summary.depositDurationNote")) }}
			</div>
			<div>{{ transformI18n($t("property-manage_report-manage.arrears-details-list.summary.otherDurationNote")) }}</div>
			<div>{{ transformI18n($t("property-manage_report-manage.arrears-details-list.summary.arrearsAmountNote")) }}</div>
		</section>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
.summary {
	margin-top: 12px;
}
</style>
