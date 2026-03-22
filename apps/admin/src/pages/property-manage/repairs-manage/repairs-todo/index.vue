<script lang="ts" setup>
definePage({
	meta: {
		// 报修待办
		title: "propertyManage_repairsManage.repairs-todo.pageTitle",
		icon: "mdi:clipboard-clock",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.repairsTodo"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type RepairsTodoFormProps, defaultForm } from "./components/form";
import type { RepairsTodoListItem, RepairsTodoQueryParams, RepairsTodoFormVO } from "@01s-11comm/type";
import RepairsTodoForm from "./components/form.vue";
import { useRepairsTodoListQuery } from "@/api/property-manage/repairs-manage/repairs-todo";
import { repairStatusOptions } from "@01s-11comm/type";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const repairsTodoFormInstance = ref<InstanceType<typeof RepairsTodoForm> | null>(null);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-todo.fields.workOrderNumber")),
		),
		prop: "workOrderNumber",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-todo.fields.location")),
		),
		prop: "location",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-todo.fields.repairType")),
		),
		prop: "repairType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-todo.fields.maintenanceType")),
		),
		prop: "maintenanceType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-todo.fields.reporter")),
		),
		prop: "reporter",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-todo.fields.contactInfo")),
		),
		prop: "contactInfo",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.repairs-todo.fields.appointmentTime")),
		),
		prop: "appointmentTime",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("propertyManage_repairsManage.repairs-todo.fields.status"))),
		prop: "status",
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
	title: transformI18n($t("propertyManage_repairsManage.repairs-todo.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & RepairsTodoQueryParams = {
	name: "",
	status: "",
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
} = useRepairsTodoListQuery(plusSearchDefaultValues);

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-todo.search.workOrderNumber")),
		prop: "workOrderNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-todo.search.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs-todo.search.status")),
		prop: "status",
		valueType: "select",
		options: repairStatusOptions,
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

interface OpenDialogParams {
	mode: Mode;
	row?: RepairsTodoListItem;
}

function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const formValue: RepairsTodoFormVO = isAdd.value
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

	const formProps: RepairsTodoFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("propertyManage_repairsManage.repairs-todo.dialogs.addTitle"))
				: transformI18n($t("propertyManage_repairsManage.repairs-todo.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(RepairsTodoForm, {
				ref: repairsTodoFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = repairsTodoFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = repairsTodoFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					repairsTodoFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await repairsTodoFormInstance.value?.plusFormInstance?.handleSubmit();
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

function handleEdit(row: RepairsTodoListItem) {
	openDialog({ mode: "edit", row });
}

function handleView(row: RepairsTodoListItem) {
	openDialog({ mode: "info", row });
}

async function handleDelete(row: RepairsTodoListItem) {
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
