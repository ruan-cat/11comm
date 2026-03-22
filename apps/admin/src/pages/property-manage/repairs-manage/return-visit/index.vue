<script lang="ts" setup>
definePage({
	meta: {
		// 报修回访
		title: "propertyManage_repairsManage.return-visit.pageTitle",
		icon: "mdi:phone-return",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.returnVisit"),
	},
});

import { ref, h } from "vue";
import consola from "consola";
import { useToggle } from "@vueuse/core";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { useMode, type Mode } from "@/composables/use-mode";
import { type ReturnVisitFormProps, defaultForm } from "./components/form";
import { type ReturnVisitFormVO, type ReturnVisitListItem, type ReturnVisitQueryParams } from "@01s-11comm/type";
import { repairTypeOptions, returnVisitStatusOptions } from "@01s-11comm/type";
import ReturnVisitForm from "./components/form.vue";
import { useReturnVisitListQuery } from "@/api/property-manage/repairs-manage/return-visit";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 表单组件实例 */
const returnVisitFormInstance = ref<InstanceType<typeof ReturnVisitForm> | null>(null);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.return-visit.fields.workOrderNumber")),
		),
		prop: "工单编号",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.return-visit.fields.location")),
		),
		prop: "位置",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.return-visit.fields.repairType")),
		),
		prop: "报修类型",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.return-visit.fields.reporter")),
		),
		prop: "报修人",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.return-visit.fields.contactInfo")),
		),
		prop: "联系方式",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.return-visit.fields.appointmentTime")),
		),
		prop: "预约时间",
		width: 150,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("propertyManage_repairsManage.return-visit.fields.returnVisitStatus")),
		),
		prop: "回访状态",
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
	title: transformI18n($t("propertyManage_repairsManage.return-visit.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & ReturnVisitQueryParams = {
	workOrderNumber: "",
	repairType: "",
	reporter: "",
	contactPhone: "",
	returnVisitStatus: "",
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
} = useReturnVisitListQuery(plusSearchDefaultValues);

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.search.workOrderNumber")),
		prop: "workOrderNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.search.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.search.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.search.contactPhone")),
		prop: "contactPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("propertyManage_repairsManage.return-visit.search.returnVisitStatus")),
		prop: "returnVisitStatus",
		valueType: "select",
		options: returnVisitStatusOptions,
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
	row?: ReturnVisitListItem;
}

function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	const formValue: ReturnVisitFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					workOrderNumber: row?.workOrderNumber || "",
					location: row?.location || "",
					repairType: row?.repairType || "",
					reporter: row?.reporter || "",
					contactInfo: row?.contactInfo || "",
					appointmentTime: row?.appointmentTime || "",
					returnVisitStatus: row?.returnVisitStatus || "",
					remark: row?.remark || "",
				})
			: structuredClone(defaultForm);
	const defaultValues = structuredClone(formValue);

	const formProps: ReturnVisitFormProps = {
		form: formValue,
		defaultValues,
	};

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("propertyManage_repairsManage.return-visit.dialogs.addTitle"))
				: transformI18n($t("propertyManage_repairsManage.return-visit.dialogs.editTitle")),
		props: formProps,
		contentRenderer: () =>
			h(ReturnVisitForm, {
				ref: returnVisitFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = returnVisitFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = returnVisitFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					returnVisitFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await returnVisitFormInstance.value?.plusFormInstance?.handleSubmit();
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

function handleEdit(row: ReturnVisitListItem) {
	openDialog({ mode: "edit", row });
}

function handleView(row: ReturnVisitListItem) {
	openDialog({ mode: "info", row });
}

async function handleDelete(row: ReturnVisitListItem) {
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

<style lang="scss" scoped>
.index-root {
}
</style>
