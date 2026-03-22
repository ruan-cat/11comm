<script lang="ts" setup>
definePage({
	meta: {
		// 报修已办
		title: "propertyManage_repairsManage.repairs-have-done.pageTitle",
		icon: "mdi:clipboard-check",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.repairsHaveDone"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type RepairsHaveDoneFormProps, defaultForm } from "./components/form";
import type { RepairsHaveDoneFormVO, RepairsHaveDoneListItem, RepairsHaveDoneQueryParams } from "@01s-11comm/type";
import RepairsHaveDoneForm from "./components/form.vue";
import { useRepairsHaveDoneListQuery } from "@/api/property-manage/repairs-manage/repairs-have-done";
import { maintenanceTypeOptions, repairTypeOptions, repairStatusOptions } from "@01s-11comm/type";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const repairsHaveDoneFormInstance = ref<InstanceType<typeof RepairsHaveDoneForm> | null>(null);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-have-done.fields.workOrderNumber")),
		),
		prop: "工单编号",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-have-done.fields.location")),
		),
		prop: "位置",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-have-done.fields.repairType")),
		),
		prop: "报修类型",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-have-done.fields.maintenanceType")),
		),
		prop: "维修类型",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-have-done.fields.reporter")),
		),
		prop: "报修人",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-have-done.fields.contactInfo")),
		),
		prop: "联系方式",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-have-done.fields.appointmentTime")),
		),
		prop: "预约时间",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-have-done.fields.status")),
		),
		prop: "状态",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("propertyManage_repairsManage.repairs-have-done.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & RepairsHaveDoneQueryParams = {
	maintenanceType: "",
	reporter: "",
	repairPhone: "",
	repairType: "",
	repairStatus: "",
	workOrderNumber: "",
	pageIndex: 1,
	pageSize: 10,
};

const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useRepairsHaveDoneListQuery(plusSearchDefaultValues);

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.search.maintenanceType")),
		prop: "maintenanceType",
		valueType: "select",
		options: maintenanceTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.search.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.search.repairPhone")),
		prop: "repairPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.search.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.search.repairStatus")),
		prop: "repairStatus",
		valueType: "select",
		options: repairStatusOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-have-done.search.workOrderNumber")),
		prop: "workOrderNumber",
		valueType: "input",
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}

const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

function openDialog(params: { mode: Mode; row?: RepairsHaveDoneListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formValue: RepairsHaveDoneFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					workOrderNumber: row?.workOrderNumber || "",
					location: row?.location || "",
					repairType: row?.repairType || "",
					maintenanceType: row?.maintenanceType || "",
					reporter: row?.reporter || "",
					contactInfo: row?.contactInfo || "",
					appointmentTime: row?.appointmentTime || "",
					status: row?.status || "",
					remark: row?.remark || "",
				})
			: structuredClone(defaultForm);
	const defaultValues = structuredClone(formValue);

	const formProps: RepairsHaveDoneFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("propertyManage_repairsManage.repairs-have-done.dialogs.addTitle"))
				: transformI18n($t("propertyManage_repairsManage.repairs-have-done.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(RepairsHaveDoneForm, {
				ref: repairsHaveDoneFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = repairsHaveDoneFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = repairsHaveDoneFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					repairsHaveDoneFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await repairsHaveDoneFormInstance.value?.plusFormInstance?.handleSubmit();
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

function handleAdd() {
	openDialog({ mode: "add" });
}

function handleEdit(row: RepairsHaveDoneListItem) {
	openDialog({ mode: "edit", row });
}

function handleView(row: RepairsHaveDoneListItem) {
	openDialog({ mode: "info", row });
}

async function handleDelete(row: RepairsHaveDoneListItem) {
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
